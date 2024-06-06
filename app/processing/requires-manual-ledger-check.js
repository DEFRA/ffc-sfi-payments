const { processingConfig } = require('../config')
const { getCompletedPaymentRequests } = require('./get-completed-payment-requests')
const { ignoreZeroValueSplits } = require('./ignore-zero-value-splits')

const requiresManualLedgerCheck = async (paymentRequest) => {
  if (!processingConfig.useManualLedgerCheck) {
    return false
  }

  if (paymentRequest.value === 0) {
    return false
  }

  if (paymentRequest.value < 0) {
    return true
  }

  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)
  const paymentRequestsToCheck = ignoreZeroValueSplits(previousPaymentRequests)
  return paymentRequestsToCheck.length && paymentRequestsToCheck.some(x => x.value < 0)
}

module.exports = {
  requiresManualLedgerCheck
}
