const { processPaymentRequests } = require('./process-payment-requests')
const { processingConfig } = require('../config')

const start = async () => {
  try {
    await processPaymentRequests()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.paymentProcessingInterval)
  }
}

module.exports = {
  start
}
