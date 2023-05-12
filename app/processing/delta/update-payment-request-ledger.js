const { reallocateToLedger } = require('./reallocate-to-ledger')
const { splitToLedger } = require('./split-to-ledger')

const updatePaymentRequestLedger = (paymentRequest, unsettledValue, unsettledLedger) => {
  if (unsettledValue >= Math.abs(paymentRequest.value)) {
    return reallocateToLedger(paymentRequest, unsettledLedger)
  }
  return splitToLedger(paymentRequest, unsettledValue, unsettledLedger)
}

module.exports = {
  updatePaymentRequestLedger
}
