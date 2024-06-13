const { AP } = require('../constants/ledgers')

const ignoreZeroValueSplits = (paymentRequests) => {
  if (!paymentRequests.length) {
    return []
  }

  const paymentRequestsToRemove = paymentRequests.filter(paymentRequest =>
    paymentRequest.ledger === AP &&
    paymentRequest.value !== 0 &&
    paymentRequests.some(otherPaymentRequest =>
      paymentRequest.ledger === otherPaymentRequest.ledger &&
      paymentRequest.paymentRequestNumber === otherPaymentRequest.paymentRequestNumber &&
      paymentRequest.originalInvoiceNumber === otherPaymentRequest.originalInvoiceNumber &&
      paymentRequest.value === -otherPaymentRequest.value
    )
  ).map(paymentRequest => paymentRequest.paymentRequestNumber)

  return paymentRequests.filter(paymentRequest => !paymentRequestsToRemove.includes(paymentRequest.paymentRequestNumber))
}

module.exports = {
  ignoreZeroValueSplits
}
