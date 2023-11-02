const { getPaymentRequests } = require('./scheduled')
const { processPaymentRequest } = require('./process-payment-request')

const processPaymentRequests = async () => {
  const scheduledPaymentRequests = await getPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
  }
}

module.exports = {
  processPaymentRequests
}
