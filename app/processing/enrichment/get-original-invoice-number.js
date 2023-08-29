const getOriginalInvoiceNumber = (paymentRequests) => {
  const existingOriginalInvoiceNumbers = paymentRequests
  .filter(x => x.originalInvoiceNumber !== null)
  .map(x => x.originalInvoiceNumber)
  if (existingOriginalInvoiceNumbers.length) {
    return existingOriginalInvoiceNumbers[0]
  }

  return paymentRequests.find(x => x.paymentRequestNumber === 1)?.invoiceNumber ?? paymentRequests[0]?.invoiceNumber
}

module.exports = {
  getOriginalInvoiceNumber
}
