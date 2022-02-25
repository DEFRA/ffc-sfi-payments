const { AP, AR } = require('../../ledgers')

const getOutstandingLedgerValues = (previousPaymentRequests) => {
  const outstandingLedgerValues = {
    AP: getOutstandingValuesAP(previousPaymentRequests.filter(x => x.ledger === AP)),
    AR: getOutstandingValuesAR(previousPaymentRequests.filter(x => x.ledger === AR))
  }

  outstandingLedgerValues.AP = Math.abs(outstandingLedgerValues.AP)
  outstandingLedgerValues.AR = Math.abs(outstandingLedgerValues.AR)
  outstandingLedgerValues.hasOutstanding = !!(outstandingLedgerValues.AP > 0 || outstandingLedgerValues.AR > 0)

  return outstandingLedgerValues
}

const getOutstandingValuesAP = (previousPaymentRequestsAP) => {
  return previousPaymentRequestsAP
    .filter(x => (x.settledValue ?? 0) !== x.value)
    .reduce((x, y) => x + (y.value - (y.settledValue ?? 0)), 0)
}

const getOutstandingValuesAR = (previousPaymentRequestsAR) => {
  return previousPaymentRequestsAR.reduce((x, y) => x + y.value, 0)
}

module.exports = getOutstandingLedgerValues
