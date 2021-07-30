const processPaymentRequests = require('./process-payment-requests')
const config = require('../config')

const start = async () => {
  try {
    await processPaymentRequests()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, config.paymentProcessingInterval)
  }
}

module.exports = {
  start
}
