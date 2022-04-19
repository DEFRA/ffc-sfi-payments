const publishPendingPaymentRequests = require('./publish-pending-payment-requests')
const config = require('../config')

const start = async () => {
  try {
    await publishPendingPaymentRequests()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, config.paymentRequestPublishingInterval)
  }
}

module.exports = {
  start
}
