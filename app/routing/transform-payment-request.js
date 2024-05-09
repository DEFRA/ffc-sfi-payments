const { getCompletedPaymentRequests } = require('../processing/get-completed-payment-requests')
const { confirmDueDates } = require('../processing/due-dates')
const { enrichPaymentRequests } = require('../processing/enrichment')
const { resetDueDatesForSFI23 } = require('./reset-due-dates-for-sfi23')

const transformPaymentRequest = async (paymentRequest, paymentRequests) => {
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)
  resetDueDatesForSFI23(paymentRequests, previousPaymentRequests, paymentRequest.dueDate)
  const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
  paymentRequests = enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)
  return paymentRequests
}

module.exports = {
  transformPaymentRequest
}
