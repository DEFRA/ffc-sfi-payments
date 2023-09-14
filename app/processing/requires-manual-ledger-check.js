const { processingConfig } = require('../config')
const { getCompletedPaymentRequests } = require('./get-completed-payment-requests')

const requiresManualLedgerCheck = async (paymentRequest) => {
  if (!processingConfig.useManualLedgerCheck) {
    return false
  }

  if (paymentRequest.value < 0) {
    return true
  }

  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)
  return previousPaymentRequests.length && previousPaymentRequests.some(x => x.value < 0)
}

module.exports = {
  requiresManualLedgerCheck
}
