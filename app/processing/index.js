const processScheduledPaymentRequests = require('./process-scheduled-payment-requests')
const config = require('../config')

const start = async () => {
  try {
    await processScheduledPaymentRequests()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, config.paymentProcessingInterval)
  }
}

module.exports = {
  start
}
