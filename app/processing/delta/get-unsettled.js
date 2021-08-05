const getUnsettled = (previousPaymentRequests) => {
  const unsettled = []
  previousPaymentRequests.reduce((x, y) => {
    if (!x[y.ledger]) {
      x[y.ledger] = { ledger: y.ledger, value: 0 }
      unsettled.push(x[y.ledger])
    }
    x[y.ledger].value += Math.abs(y.value)
    return x
  }, {})
  if (unsettled.some(x => x.value !== 0)) {
    return unsettled
  }
}

module.exports = getUnsettled
