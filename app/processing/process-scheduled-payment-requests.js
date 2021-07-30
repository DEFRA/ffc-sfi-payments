const getScheduledPaymentRequests = require('./get-scheduled-payment-requests')

const processScheduledPaymentRequests = async () => {
  const scheduledPaymentRequests = await getScheduledPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    const paymentRequest = scheduledPaymentRequest.paymentRequest
    const previousPaymentRequests = getPreviousPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear)
  }
}

module.exports = processScheduledPaymentRequests
