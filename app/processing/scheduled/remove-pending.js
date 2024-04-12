const { getPendingPaymentRequests } = require('./get-pending-payment-requests')

const removePending = async (scheduledPaymentRequests, started, transaction) => {
  const pending = await getPendingPaymentRequests(scheduledPaymentRequests, started, transaction)
  return scheduledPaymentRequests.filter(x =>
    !pending.some(y => y.schemeId === x.paymentRequest.schemeId && y.frn === x.paymentRequest.frn && y.marketingYear === x.paymentRequest.marketingYear && y.paymentRequestNumber < x.paymentRequest.paymentRequestNumber))
}

module.exports = {
  removePending
}
