
const getInvoiceCorrectionReference = (paymentRequests) => {
  // last AR payment request
  const lastARId = paymentRequests
    .filter(x => x.ledger === 'AR')
    .reduce((x, y) => {
      return x.completedPaymentRequestId < y.completedPaymentRequestId ? x.completedPaymentRequestId : y.completedPaymentRequestId
    }, 0)
  return paymentRequests.find(x => x.completedPaymentRequestId === lastARId)?.invoiceNumber
}

module.exports = getInvoiceCorrectionReference
