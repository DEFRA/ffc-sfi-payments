const processScheduledPaymentRequests = require('./process-scheduled-payment-requests')
const processingInterval = 5000

const start = async () => {
  setInterval(async () => processScheduledPaymentRequests(), processingInterval)
  console.log('Payment processing started')
}

module.exports = {
  start
}
