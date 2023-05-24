const { getPendingPaymentRequests } = require('./get-pending-payment-requests')

const removePending = async (scheduledPaymentRequests, started, transaction) => {
  const pending = await getPendingPaymentRequests(started, transaction)
  return scheduledPaymentRequests.filter(x =>
    !pending.some(y => y.paymentRequest.schemeId === x.paymentRequest.schemeId && y.paymentRequest.frn === x.paymentRequest.frn && y.paymentRequest.marketingYear === x.paymentRequest.marketingYear))
}

module.exports = {
  removePending
}
