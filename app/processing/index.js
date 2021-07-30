const processPendingPaymentRequests = require('./process-pending-payment-requests')
const processingInterval = 5000

const start = () => {
  setInterval(() => processPendingPaymentRequests(), processingInterval)
  console.log('Payment processing started')
}

module.exports = {
  start
}
