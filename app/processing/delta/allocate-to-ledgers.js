const reallocateToLedger = require('./reallocate-to-ledger')
const splitToLedger = require('./split-to-ledger')

const allocateToLedgers = (paymentRequest, unsettled) => {
  if (unsettled.AR > 0 && paymentRequest.ledger === 'AP') {
    return updatePaymentRequest(paymentRequest, unsettled.AR, 'AR')
  }
  if (unsettled.AP > 0 && paymentRequest.ledger === 'AR') {
    return updatePaymentRequest(paymentRequest, unsettled.AP, 'AP')
  }
  return [paymentRequest]
}

const updatePaymentRequest = (paymentRequest, unsettledValue, unsettledLedger) => {
  if (unsettledValue >= Math.abs(paymentRequest.value)) {
    return reallocateToLedger(paymentRequest, unsettledLedger)
  }
  return splitToLedger(paymentRequest, unsettledValue, unsettledLedger)
}

module.exports = allocateToLedgers
