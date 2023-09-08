const { BPS } = require('../constants/schemes')
const { confirmPaymentRequestNumber } = require('./confirm-payment-request-number')
const { getCompletedPaymentRequests } = require('./get-completed-payment-requests')
const { calculateDelta } = require('./delta')
const { confirmDueDates } = require('./due-dates')
const { enrichPaymentRequests } = require('./enrichment')
const { applyDualAccounting } = require('./dual-accounting')

const transformPaymentRequest = async (paymentRequest, paymentRequests) => {
  // If BPS, then need to confirm payment request number as rekeyed claims can result in duplicate payment request numbers
  if (paymentRequest.schemeId === BPS) {
    paymentRequest.paymentRequestNumber = await confirmPaymentRequestNumber(paymentRequest)
  }

  // Check to see if payment request has had a previous payment request.
  // if yes, need to treat as post payment adjustment and calculate Delta which can result in payment request splitting
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)

  // if no initial paymentRequests, apply dual accounting and set both deltaPaymentRequests and paymentRequests, or return if no previousPaymentRequests
  let deltaPaymentRequests = null
  if (!paymentRequests) {
    const sanitizedPaymentRequest = applyDualAccounting(paymentRequest, previousPaymentRequests)
    if (!previousPaymentRequests.length) {
      return { completedPaymentRequests: [sanitizedPaymentRequest] }
    }
    deltaPaymentRequests = calculateDelta(sanitizedPaymentRequest, previousPaymentRequests)
    paymentRequests = deltaPaymentRequests.completedPaymentRequests
  }

  const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
  paymentRequests = enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)

  // return the whole deltaPaymentRequests if exists or paymentRequests if not
  return deltaPaymentRequests ?? paymentRequests
}

module.exports = {
  transformPaymentRequest
}
