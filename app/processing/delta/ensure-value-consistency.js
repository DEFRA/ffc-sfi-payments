const ensureValueConsistency = (paymentRequest) => {
  // ensure no value gained or lost. if variation between total and lines apply difference to first gross line
  const variation = paymentRequest.value - (paymentRequest.invoiceLines.reduce((x, y) => x + y.value, 0))
  if (variation !== 0) {
    const firstGrossLineIndex = paymentRequest.invoiceLines.findIndex(x => x.description.startsWith('G00'))
    paymentRequest.invoiceLines[firstGrossLineIndex].value += variation
    paymentRequest.value += variation
  }
}

module.exports = ensureValueConsistency
