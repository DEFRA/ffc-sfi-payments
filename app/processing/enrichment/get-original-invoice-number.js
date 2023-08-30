const getOriginalInvoiceNumber = (paymentRequests) => {
  // retain original invoice number if it already exists
  const existingOriginalInvoiceNumbers = paymentRequests
    .filter(x => x.originalInvoiceNumber !== null && typeof x.originalInvoiceNumber !== 'undefined')
    .map(x => x.originalInvoiceNumber)
  if (existingOriginalInvoiceNumbers.length) {
    return existingOriginalInvoiceNumbers[0]
  }
  return paymentRequests.find(x => x.paymentRequestNumber === 1)?.invoiceNumber ?? paymentRequests[0]?.invoiceNumber
}

module.exports = {
  getOriginalInvoiceNumber
}
