const db = require('../data')
const { zeroValueSplit } = require('../processing/delta/zero-value-split')
const { sendZeroValueEvent } = require('../event')

const updateSchedule = async (scheduleId, transaction) => {
  await db.schedule.update(
    { completed: new Date() },
    { where: { scheduleId }, transaction }
  )
}

const processInvoiceLines = async (
  invoiceLines,
  completedPaymentRequestId,
  transaction
) => {
  for (const invoiceLine of invoiceLines) {
    const completedInvoiceLine = invoiceLine.dataValues ?? invoiceLine
    completedInvoiceLine.completedPaymentRequestId = completedPaymentRequestId
    if (completedInvoiceLine.value !== 0) {
      await db.completedInvoiceLine.create(completedInvoiceLine, {
        transaction
      })
    }
  }
}

const hasOffsettingValues = paymentRequests => {
  if (paymentRequests.length === 1) {
    const lines = paymentRequests[0].invoiceLines
    const totalPos = lines.reduce(
      (sum, line) => (line.value > 0 ? sum + line.value : sum),
      0
    )
    const totalNeg = lines.reduce(
      (sum, line) => (line.value < 0 ? sum + line.value : sum),
      0
    )
    const hasLineOffsets = totalPos + totalNeg === 0 && totalPos !== 0

    console.log('Single request line offsets:', {
      hasLineOffsets,
      totalPos,
      totalNeg,
      invoiceNumber: paymentRequests[0].invoiceNumber
    })

    return hasLineOffsets
  }

  const hasOffsets =
    paymentRequests.length === 2 &&
    paymentRequests[0].value + paymentRequests[1].value === 0 &&
    (paymentRequests[0].value !== 0 || paymentRequests[1].value !== 0)

  console.log('Multiple request offsets:', {
    hasOffsets,
    requests: paymentRequests.map(x => ({
      value: x.value,
      invoiceNumber: x.invoiceNumber,
      lines: x.invoiceLines.map(l => l.value)
    }))
  })

  return hasOffsets
}

const createOutboxEntry = async (
  paymentRequest,
  savedRequest,
  hasOffset,
  transaction
) => {
  const isSplitPayment =
    paymentRequest.originalInvoiceNumber ||
    paymentRequest.invoiceNumber?.endsWith('A') ||
    paymentRequest.invoiceNumber?.endsWith('B')

  const hasNonZeroLines = paymentRequest.invoiceLines.some(x => x.value !== 0)
  const shouldCreateOutbox = hasOffset || isSplitPayment || hasNonZeroLines

  console.log('Outbox creation decision:', {
    invoiceNumber: paymentRequest.invoiceNumber,
    shouldCreateOutbox,
    isSplitPayment,
    hasOffset,
    hasNonZeroLines,
    lineValues: paymentRequest.invoiceLines.map(x => x.value)
  })

  if (shouldCreateOutbox) {
    await db.outbox.create(
      {
        completedPaymentRequestId: savedRequest.completedPaymentRequestId,
        status: 'pending'
      },
      { transaction }
    )
    console.log('Created outbox entry:', paymentRequest.invoiceNumber)
  } else {
    await sendZeroValueEvent(paymentRequest)
    console.log('Sent zero value event:', paymentRequest.invoiceNumber)
  }
}

const processPaymentRequest = async (
  paymentRequest,
  hasOffset,
  transaction
) => {
  const completedPaymentRequest = paymentRequest.dataValues ?? paymentRequest
  const savedRequest = await db.completedPaymentRequest.create(
    completedPaymentRequest,
    { transaction }
  )

  await processInvoiceLines(
    paymentRequest.invoiceLines,
    savedRequest.completedPaymentRequestId,
    transaction
  )
  await createOutboxEntry(paymentRequest, savedRequest, hasOffset, transaction)
}

const completePaymentRequests = async (scheduleId, paymentRequests) => {
  const transaction = await db.sequelize.transaction()
  try {
    const schedule = await db.schedule.findByPk(scheduleId, { transaction })
    if (schedule.completed === null) {
      await updateSchedule(scheduleId, transaction)

      if (
        paymentRequests.length === 1 &&
        hasOffsettingValues(paymentRequests)
      ) {
        const isFirstPayment = !paymentRequests[0].originalInvoiceNumber
        const splitRequests = zeroValueSplit(paymentRequests[0], isFirstPayment)

        console.log('Split payment requests:', {
          original: paymentRequests[0].invoiceNumber,
          split: splitRequests.map(x => x.invoiceNumber)
        })

        for (const splitRequest of splitRequests) {
          await processPaymentRequest(splitRequest, true, transaction)
        }
      } else {
        const offset = hasOffsettingValues(paymentRequests)
        for (const paymentRequest of paymentRequests) {
          await processPaymentRequest(paymentRequest, offset, transaction)
        }
      }
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  completePaymentRequests
}
