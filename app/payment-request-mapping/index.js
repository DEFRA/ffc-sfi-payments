const db = require('../data')
const paymentRequestSchema = require('./payment-request-schema')
const generateInvoiceNumber = require('./generate-invoice-number')

async function savePaymentRequest (paymentRequest) {
  const validationResult = paymentRequestSchema.validate(paymentRequest)

  if (validationResult.error) {
    throw new Error(`Payment request is invalid. ${validationResult.error.message}`)
  }

  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequestRow = await db.paymentRequest.findOne({
      transaction,
      where: {
        agreementNumber: paymentRequest.agreementNumber
      }
    })
    if (paymentRequestRow) {
      console.log('Duplicate payment request!')
      await transaction.rollback()
    } else {
      paymentRequest.invoiceNumber = generateInvoiceNumber(paymentRequest)
      const savedPaymentRequest = await db.paymentRequest.create(paymentRequest, { transaction })
      await processInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

async function processInvoiceLines (invoiceLines, paymentRequestId, transaction) {
  if (invoiceLines.length > 0) {
    for (const invoiceLine of invoiceLines) {
      await db.invoiceLine.create({ paymentRequestId, ...invoiceLine }, { transaction })
    }
  }
}

module.exports = {
  savePaymentRequest
}
