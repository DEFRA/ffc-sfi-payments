const getOriginalInvoiceNumber = (paymentRequests) => {
  return paymentRequests.find(x => x.paymentRequestNumber === 1)?.invoiceNumber ?? paymentRequests[0]?.invoiceNumber
}

module.exports = {
  getOriginalInvoiceNumber
}
