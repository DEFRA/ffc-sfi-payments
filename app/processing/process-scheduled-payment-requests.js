const getScheduledPaymentRequests = require('./get-scheduled-payment-requests')
const processPaymentRequest = require('./process-payment-request')

const processScheduledPaymentRequests = async () => {
  const scheduledPaymentRequests = await getScheduledPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
  }
}

module.exports = processScheduledPaymentRequests
