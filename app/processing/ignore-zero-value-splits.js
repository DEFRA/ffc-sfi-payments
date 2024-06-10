const { AP } = require('../constants/ledgers')

const ignoreZeroValueSplits = (paymentRequests) => {
  if (!paymentRequests.length) {
    return []
  }

  const paymentRequestsToRemove = []

  for (const paymentRequest of paymentRequests) {
    for (const otherPaymentRequest of paymentRequests) {
      if (
        paymentRequest !== otherPaymentRequest &&
        paymentRequest.ledger === AP &&
        paymentRequest.ledger === otherPaymentRequest.ledger &&
        paymentRequest.paymentRequestNumber === otherPaymentRequest.paymentRequestNumber &&
        paymentRequest.originalInvoiceNumber === otherPaymentRequest.originalInvoiceNumber &&
        paymentRequest.value === -otherPaymentRequest.value
      ) {
        paymentRequestsToRemove.push(paymentRequest.paymentRequestNumber)
      }
    }
  }

  return paymentRequests.filter(paymentRequest => !paymentRequestsToRemove.includes(paymentRequest.paymentRequestNumber))
}

module.exports = {
  ignoreZeroValueSplits
}
