const { BPS } = require('../constants/schemes')
const confirmDueDates = require('./confirm-due-dates')
const calculateDelta = require('./delta')
const enrichPaymentRequests = require('./enrichment')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')
const { confirmPaymentRequestNumber } = require('./confirm-payment-request-number')

const transformPaymentRequest = async (paymentRequest) => {
  // If BPS, then need to confirm payment request number as rekeyed claims can result in duplicate payment request numbers
  if (paymentRequest.schemeId === BPS) {
    paymentRequest.paymentRequestNumber = await confirmPaymentRequestNumber(paymentRequest)
  }
  // Check to see if payment request has had a previous payment request.
  // if yes, need to treat as post payment adjustment and calculate Delta which can result in payment request splitting
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear, paymentRequest.agreementNumber, paymentRequest.paymentRequestNumber)
  if (previousPaymentRequests.length) {
    const deltaPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    const confirmedPaymentRequests = confirmDueDates(deltaPaymentRequests.completedPaymentRequests, previousPaymentRequests)
    deltaPaymentRequests.completedPaymentRequests = enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)
    return deltaPaymentRequests
  }
  // otherwise original payment request does not require further processing so can be returned without modification
  return { completedPaymentRequests: [paymentRequest] }
}

module.exports = transformPaymentRequest
