const db = require('../data')
const paymentRequestSchema = require('./payment-request-schema')
const { createInvoiceNumber } = require('../invoice-number')
const { convertToPence } = require('../currency-convert')

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
      paymentRequest.invoiceNumber = createInvoiceNumber(paymentRequest)
      paymentRequest.schemeId = await getSchemeId(paymentRequest.sourceSystem, transaction)
      paymentRequest.ledger = 'AP'
      paymentRequest.value = convertToPence(paymentRequest.value)
      paymentRequest.schemeId = await getSchemeId(paymentRequest.sourceSystem, transaction)
      paymentRequest.frn ?? await getFrn(paymentRequest.sbi, transaction)
      const fundCode = await getFundCode(schemeId, transaction)

      const savedPaymentRequest = await db.paymentRequest.create(paymentRequest, { transaction })
      await processInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, fundCode, transaction)
      await db.schedule.create({ schemeId: paymentRequest.schemeId, paymentRequestId: savedPaymentRequest.paymentRequestId, planned: new Date() }, { transaction })
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

async function processInvoiceLines (invoiceLines, paymentRequestId, fundCode, transaction) {
  for (const invoiceLine of invoiceLines) {
    // ignore any net lines
    if (!invoiceLine.description.startsWith('N00')) {
      invoiceLine.value = convertToPence(invoiceLine.value)
      invoiceLine.schemeCode = await getSchemeCode(invoiceLine.standardCode, transaction)
      invoiceLine.fundCode = fundCode
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

async function getFrn (sbi, transaction) {
  const frn = await db.frn.findOne({ where: { sbi } }, { transaction })
  if (frn) {
    return Number(frn.frn)
  }

  throw new Error('No FRN found in db table frn using SBI look up !')
}

async function getFundCode (schemeId, transaction) {
  const fundCode = await db.fundCode.findOne({ where: { schemeId } }, { transaction })
  return fundCode.fundCode
}

module.exports = {
  savePaymentRequest
}
