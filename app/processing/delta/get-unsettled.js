const getUnsettled = (previousPaymentRequests) => {
  const unsettled = { AP: 0, AR: 0 }
  previousPaymentRequests
    .filter(x => x.settled == null)
    .map(x => { unsettled[x.ledger] += x.value })

  unsettled.AP = Math.abs(unsettled.AP)
  unsettled.AR = Math.abs(unsettled.AR)
  unsettled.hasUnsettled = !!(unsettled.AP > 0 || unsettled.AR > 0)

  return unsettled
}

module.exports = getUnsettled
