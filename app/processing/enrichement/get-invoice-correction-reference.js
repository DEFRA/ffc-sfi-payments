
const getInvoiceCorrectionReference = (paymentRequests) => {
  // last AR payment request
  const lastARId = paymentRequests
    .filter(x => x.ledger === 'AR')
    .reduce((x, y) => {
      return x < y.completedPaymentRequestId ? x : y.completedPaymentRequestId
    })

  return paymentRequests.find(x => x.completedPaymentRequestId === lastARId)?.invoiceNumber
}

module.exports = getInvoiceCorrectionReference
