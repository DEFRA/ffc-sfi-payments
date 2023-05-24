const getInvoiceLineTotal = (paymentRequest) => {
  return paymentRequest.invoiceLines.reduce((x, y) => x + y.value, 0)
}

module.exports = {
  getInvoiceLineTotal
}
