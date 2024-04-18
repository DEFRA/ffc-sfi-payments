const { getScheduledPaymentRequests } = require('./get-scheduled-payment-requests')

const getPaymentRequests = async () => {
  return getScheduledPaymentRequests()
}

module.exports = {
  getPaymentRequests
}
