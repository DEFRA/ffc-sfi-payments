const getUnsettled = (previousPaymentRequests) => {
  const unsettled = previousPaymentRequests.reduce((x, y) => {
    if (!x[y.ledger]) {
      x[y.ledger] = 0
    }
    x[y.ledger].value += Math.abs(y.value)
    return x
  }, {})

  unsettled.hasUnsettled = !!(unsettled.AP > 0 || unsettled.AR > 0)

  return unsettled
}

module.exports = getUnsettled
