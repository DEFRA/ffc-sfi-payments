const ignoreZeroValueSplits = (paymentRequests) => {
  if (!paymentRequests.length) {
    return []
  }

  const paymentRequestsToRemove = new Set()

  for (const paymentRequest of paymentRequests) {
    for (const otherPaymentRequest of paymentRequests) {
      if (
        paymentRequest !== otherPaymentRequest &&
        paymentRequest.paymentRequestNumber === otherPaymentRequest.paymentRequestNumber &&
        paymentRequest.originalInvoiceNumber === otherPaymentRequest.originalInvoiceNumber &&
        paymentRequest.value === -otherPaymentRequest.value
      ) {
        if (paymentRequest.value < 0) {
          paymentRequestsToRemove.add(paymentRequest)
        } else {
          paymentRequestsToRemove.add(otherPaymentRequest)
        }
      }
    }
  }

  return paymentRequests.filter(paymentRequest => !paymentRequestsToRemove.has(paymentRequest))
}

module.exports = {
  ignoreZeroValueSplits
}
