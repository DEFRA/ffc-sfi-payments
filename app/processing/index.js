const processScheduledPaymentRequests = require('./process-scheduled-payment-requests')
const processingInterval = 5000

const start = () => {
  setInterval(() => processScheduledPaymentRequests(), processingInterval)
  console.log('Payment processing started')
}

module.exports = {
  start
}
