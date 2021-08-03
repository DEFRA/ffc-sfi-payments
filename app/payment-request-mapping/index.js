const db = require('../data')
const paymentRequestSchema = require('./payment-request-schema')

async function savePaymentRequest (paymentRequest) {
  const validationResult = paymentRequestSchema.validate(paymentRequest)

  if (validationResult.error) {
    throw new Error(`Payment request is invalid. ${validationResult.error.message}`)
  }

  const paymentRequestRow = await db.paymentRequest.findAll({
    where: {
      agreementNumber: paymentRequest.agreementNumber
    }
  })

  if (paymentRequestRow && paymentRequestRow.length > 0) {
    console.log('Duplicate payment request!')
  } else {
    const savedPaymentRequest = await db.paymentRequest.create(paymentRequest)
    await processInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId)
  }
}

async function processInvoiceLines (invoiceLines, paymentRequestId) {
  if (invoiceLines.length > 0) {
    for (const invoiceLine of invoiceLines) {
      await db.invoiceLine.create({ paymentRequestId, ...invoiceLine })
    }
  }
}

module.exports = {
  savePaymentRequest
}
