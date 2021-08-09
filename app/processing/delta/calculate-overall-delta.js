const calculateOverallDelta = (invoiceLines) => {
  return invoiceLines.reduce((x, y) => x + y.value, 0)
}

module.exports = calculateOverallDelta
