const getOutstandingLedgerValues = (previousPaymentRequests) => {
  const outstandingLedgerValues = { AP: 0, AR: 0 }
  previousPaymentRequests
    .filter(x => x.settled == null)
    .forEach(x => { outstandingLedgerValues[x.ledger] += x.value })

  outstandingLedgerValues.AP = Math.abs(outstandingLedgerValues.AP)
  outstandingLedgerValues.AR = Math.abs(outstandingLedgerValues.AR)
  outstandingLedgerValues.hasOutstanding = !!(outstandingLedgerValues.AP > 0 || outstandingLedgerValues.AR > 0)

  return outstandingLedgerValues
}

module.exports = getOutstandingLedgerValues
