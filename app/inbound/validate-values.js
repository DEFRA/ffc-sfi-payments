const validateValues = (value, invoiceLines) => {
  const lineValues = invoiceLines.reduce((x, y) => x + y.value, 0)
  console.log(value, lineValues)
  if (lineValues !== value) {
    throw new Error('Payment request is invalid. Invoice line values do not match header')
  }
}

module.exports = validateValues
