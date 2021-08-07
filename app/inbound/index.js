const db = require('../data')
const getFundCode = require('./get-fund-code')
const getExistingPaymentRequest = require('./get-existing-payment-request')
const enrichPaymentRequest = require('./enrichment/enrich-payment-request')
const createSchedule = require('./create-schedule')
const validatePaymentRequest = require('./validate-payment-request')
const processInvoiceLines = require('./process-invoice-lines')

const savePaymentRequest = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const existingPaymentRequest = await getExistingPaymentRequest(paymentRequest, transaction)
    if (existingPaymentRequest) {
      console.log('Duplicate payment request received, skipping.')
      await transaction.rollback()
    } else {
      await enrichPaymentRequest(paymentRequest, transaction)
      validatePaymentRequest(paymentRequest)
      const savedPaymentRequest = await db.paymentRequest.create(paymentRequest, { transaction })
      const fundCode = await getFundCode(paymentRequest.schemeId, transaction)
      await processInvoiceLines(paymentRequest.invoiceLines, savedPaymentRequest.paymentRequestId, fundCode, transaction)
      await createSchedule(paymentRequest, savedPaymentRequest, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  savePaymentRequest
}
