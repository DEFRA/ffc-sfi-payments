const { getPaymentRequests } = require('./scheduled')
const { processPaymentRequest } = require('./process-payment-request')

const processPaymentRequests = async () => {
  console.log('Getting payment requests for processing')
  const scheduledPaymentRequests = await getPaymentRequests()
  console.log(`Processing ${scheduledPaymentRequests.length} payment requests`)
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
  }
  console.log('Finished processing payment requests')
}

module.exports = {
  processPaymentRequests
}
