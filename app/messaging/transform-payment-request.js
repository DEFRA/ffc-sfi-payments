const { enrichPaymentRequests } = require('../processing/enrichment')
const { confirmDueDates } = require('../processing/confirm-due-dates')
const { getCompletedPaymentRequests } = require('../processing/get-completed-payment-requests')

const transformPaymentRequest = async (paymentRequest, paymentRequests) => {
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)
  const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
  paymentRequests = enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)
  return paymentRequests
}

module.exports = {
  transformPaymentRequest
}
