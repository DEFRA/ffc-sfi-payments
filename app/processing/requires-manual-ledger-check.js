const { processingConfig } = require('../config')
const { getCompletedPaymentRequests } = require('./get-completed-payment-requests')

const requiresManualLedgerCheck = async (paymentRequest) => {
  let isManualLedgerCheck
  if (!processingConfig.useManualLedgerCheck) {
    return isManualLedgerCheck
  }

  if (paymentRequest.value <= 0) {
    isManualLedgerCheck = true
    return isManualLedgerCheck
  }

  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)
  if (previousPaymentRequests.length && previousPaymentRequests.some(x => x.value < 0)) {
    isManualLedgerCheck = true
    return isManualLedgerCheck
  }
  return isManualLedgerCheck
}

module.exports = {
  requiresManualLedgerCheck
}
