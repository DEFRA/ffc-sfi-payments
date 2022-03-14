const util = require('util')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')

const requiresManualLedgerCheck = async (paymentRequest) => {
  console.log(`Payment requests: ${util.inspect(paymentRequest, false, null, true)}`)
  let requiresManualCheck = false
  if (paymentRequest.value <= 0) {
    requiresManualCheck = true
  }
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear, paymentRequest.agreementNumber, paymentRequest.paymentRequestNumber)
  if (previousPaymentRequests.length && previousPaymentRequests.some(x => x.value < 0)) {
    requiresManualCheck = true
  }
  return requiresManualCheck
}

module.exports = requiresManualLedgerCheck
