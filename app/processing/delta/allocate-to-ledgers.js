const { AP, AR } = require('../../constants/ledgers')
const reallocateToLedger = require('./reallocate-to-ledger')
const splitToLedger = require('./split-to-ledger')

const allocateToLedgers = (paymentRequest, outstandingLedgerValues) => {
  if (outstandingLedgerValues.AR > 0 && paymentRequest.ledger === AP) {
    return updatePaymentRequest(paymentRequest, outstandingLedgerValues.AR, AR)
  }
  if (outstandingLedgerValues.AP > 0 && paymentRequest.ledger === AR) {
    return updatePaymentRequest(paymentRequest, outstandingLedgerValues.AP, AP)
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
