
const calculateDelta = async (paymentRequest, previousPaymentRequests) => {
  const invoiceLines = []

  // push all invoice lines from payment request into array
  // for previous requests, do the same but inverse the values so they can later be
  // summed with current to get line deltas
  invoiceLines.push(paymentRequest.invoiceLines)
  previousPaymentRequests.map(paymentRequest =>
    paymentRequest.invoiceLines.map(invoiceLine => {
      invoiceLine.value *= -1
      invoiceLines.push(invoiceLine)
    }))

  const overallDelta = invoiceLines.reduce((x, y) => x + y.value, 0)

  // calculate line deltas
  const lineDeltas = [...invoiceLines.reduce((x, y) => {
    // group by line types, so create key representing the combination
    // exclude account code as past requests vary based on ledger
    const key = `${y.schemeCode}-${y.fundCode}-${y.description}`

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, { schemeCode: y.schemeCode, fundCode: y.fundCode, description: y.description, value: 0 })
    item.value += Number(y.value)

    return x.set(key, item)
  }, new Map()).values()]

  // ensure no value gained or lost. if variation between header and lines apply difference to first gross line
  const variation = overallDelta - lineDeltas
  if (variation > 0) {
    const firstGrossLineIndex = lineDeltas[0].findIndex(x => x.description.startsWith('G00'))
    lineDeltas[0][firstGrossLineIndex].value += variation
  }

  const ledger = overallDelta <= 0 ? 'AR' : 'AP'

  const updatedPaymentRequest = {
    ...paymentRequest,
    value: overallDelta,
    ledger,
    invoiceLines: lineDeltas.filter(x => x.value !== 0)
  }

  return [updatedPaymentRequest]
}

module.exports = calculateDelta
