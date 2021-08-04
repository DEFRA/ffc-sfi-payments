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
        agreementNumber: paymentRequest.agreementNumber,
        paymentRequestNumber: paymentRequest.paymentRequestNumber
      }
    })
    if (paymentRequestRow) {
      console.log('Duplicate payment request!')
      await transaction.rollback()
    } else {
      paymentRequest.invoiceNumber = generateInvoiceNumber(paymentRequest)
      paymentRequest.schemeId = await getSchemeId(paymentRequest.sourceSystem)
      paymentRequest.ledger = paymentRequest.ledger ? paymentRequest.ledger : 'AP'
      const savedPaymentRequest = await db.paymentRequest.create(paymentRequest, { transaction })
      await processInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, transaction)
      await db.schedule.create({ schemeId: paymentRequest.schemeId, paymentRequestId: savedPaymentRequest.paymentRequestId, planned: new Date() }, { transaction })
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
      invoiceLine.schemeCode = await getSchemeCode(invoiceLine.standardCode)
      await db.invoiceLine.create({ paymentRequestId, ...invoiceLine }, { transaction })
    }
  }
}

async function getSchemeId (sourceSystem, transaction) {
  const source = await db.sourceSystem.findOne({ where: { name: sourceSystem } }, { transaction })
  return source.schemeId
}

async function getSchemeCode (standardCode, transaction) {
  const schemeCode = await db.schemeCode.findOne({ where: { standardCode } }, { transaction })
  return schemeCode.schemeCode
}

module.exports = {
  savePaymentRequest
}
