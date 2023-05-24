const getExpectedValue = (totalValue, totalPayments, segment) => {
  return Math.trunc(totalValue / totalPayments * segment)
}

module.exports = {
  getExpectedValue
}
