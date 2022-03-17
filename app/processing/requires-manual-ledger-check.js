const config = require('../config')
const util = require('util')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')

const requiresManualLedgerCheck = async (paymentRequest) => {
  console.log(`Payment  requests: ${util.inspect(paymentRequest, false, null, true)}`)

  if (!config.useManualLedgerCheck) {
    return false
  }

  if (paymentRequest.value <= 0) {
    return true
  }

  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear, paymentRequest.agreementNumber, paymentRequest.paymentRequestNumber)
  if (previousPaymentRequests.length && previousPaymentRequests.some(x => x.value < 0)) {
    return true
  }
  return false
}

module.exports = requiresManualLedgerCheck
