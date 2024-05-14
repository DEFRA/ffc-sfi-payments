const db = require('../data')

const processPaymentRequest = async (paymentRequest, transaction) => {
  const completedPaymentRequest = paymentRequest.dataValues ?? paymentRequest
  const savedCompletedPaymentRequest = await db.completedPaymentRequest.create(completedPaymentRequest, { transaction })

  for (const invoiceLine of paymentRequest.invoiceLines) {
    await processInvoiceLine(invoiceLine, savedCompletedPaymentRequest, transaction)
  }

  if (!paymentRequest.invoiceLines.every(x => x.value === 0)) {
    await db.outbox.create({ completedPaymentRequestId: savedCompletedPaymentRequest.completedPaymentRequestId }, { transaction })
  }
}

const processInvoiceLine = async (invoiceLine, savedCompletedPaymentRequest, transaction) => {
  const completedInvoiceLine = invoiceLine.dataValues ?? invoiceLine
  completedInvoiceLine.completedPaymentRequestId = savedCompletedPaymentRequest.completedPaymentRequestId

  if (completedInvoiceLine.value !== 0) {
    await db.completedInvoiceLine.create(completedInvoiceLine, { transaction })
  }
}

const completePaymentRequests = async (scheduleId, paymentRequests) => {
  const transaction = await db.sequelize.transaction()
  try {
    const schedule = await db.schedule.findByPk(scheduleId, { transaction })

    if (schedule.completed === null) {
      await db.schedule.update({ completed: new Date() }, { where: { scheduleId }, transaction })

      for (const paymentRequest of paymentRequests) {
        await processPaymentRequest(paymentRequest, transaction)
      }
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  completePaymentRequests
}
