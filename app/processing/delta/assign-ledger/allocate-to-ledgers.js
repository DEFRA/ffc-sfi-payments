const { AP, AR } = require('../../../constants/ledgers')
const { updatePaymentRequestLedger } = require('./update-payment-request-ledger')

const allocateToLedgers = (paymentRequest, outstandingLedgerValues) => {
  if (outstandingLedgerValues.AR > 0 && paymentRequest.ledger === AP) {
    return updatePaymentRequestLedger(paymentRequest, outstandingLedgerValues.AR, AR)
  }
  if (outstandingLedgerValues.AP > 0 && paymentRequest.ledger === AR) {
    return updatePaymentRequestLedger(paymentRequest, outstandingLedgerValues.AP, AP)
  }
  return [paymentRequest]
}

module.exports = {
  allocateToLedgers
}
