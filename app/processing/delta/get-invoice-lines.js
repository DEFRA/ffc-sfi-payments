const getInvoiceLines = (paymentRequest, previousPaymentRequests) => {
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

  return invoiceLines
}

module.exports = getInvoiceLines
