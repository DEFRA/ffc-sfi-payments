const config = require('../config')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')

const requiresManualLedgerCheck = async (paymentRequest) => {
  let isManualLedgerCheck
  if (!config.useManualLedgerCheck) {
    return isManualLedgerCheck
  }

  if (paymentRequest.value <= 0) {
    isManualLedgerCheck = true
    return isManualLedgerCheck
  }

  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear, paymentRequest.agreementNumber, paymentRequest.paymentRequestNumber)
  if (previousPaymentRequests.length && previousPaymentRequests.some(x => x.value < 0)) {
    isManualLedgerCheck = true
    return isManualLedgerCheck
  }
  return isManualLedgerCheck
}

module.exports = requiresManualLedgerCheck
