const confirmDueDates = require('./confirm-due-dates')
const calculateDelta = require('./delta')
const enrichPaymentRequests = require('./enrichment')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')

const transformPaymentRequest = async (paymentRequest) => {
  // Check to see if payment request has had a previous payment request.
  // if yes, need to treat as post payment adjustment and calculate Delta which can result in payment request splitting
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear, paymentRequest.agreementNumber, paymentRequest.paymentRequestNumber)
  if (previousPaymentRequests.length) {
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    const confirmedPaymentRequests = confirmDueDates(updatedPaymentRequests, previousPaymentRequests)
    return enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)
  }
  // otherwise original payment request does not require further processing so can be returned without modification
  return [paymentRequest]
}

module.exports = transformPaymentRequest
