const ensureValueConsistency = (originalValue, paymentRequest, splitPaymentRequest) => {
  // ensure no value gained or lost. if variation between splits apply difference to first gross line
  const variation = originalValue - (paymentRequest.value + splitPaymentRequest.value)
  if (variation !== 0) {
    const firstGrossLineIndex = paymentRequest.invoiceLines.findIndex(x => x.description.startsWith('G00'))
    paymentRequest.invoiceLines[firstGrossLineIndex].value += variation
    paymentRequest.value += variation
  }
}

module.exports = ensureValueConsistency
