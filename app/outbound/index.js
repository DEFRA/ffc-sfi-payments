const { publishPendingPaymentRequests } = require('./publish-pending-payment-requests')
const { processingConfig } = require('../config')

const start = async () => {
  try {
    await publishPendingPaymentRequests()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.paymentRequestPublishingInterval)
  }
}

module.exports = {
  start
}
