const util = require('util')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')

const requiresManualLedgerCheck = async (paymentRequest) => {
  console.log(`Payment requests: ${util.inspect(paymentRequest, false, null, true)}`)
  // TODO: any recovery, any top-up that follows a recovery (value <= 0)
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
