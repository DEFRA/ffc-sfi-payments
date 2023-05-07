const { BPS } = require('../constants/schemes')
const { confirmPaymentRequestNumber } = require('./confirm-payment-request-number')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')
const calculateDelta = require('./delta')
const confirmDueDates = require('./confirm-due-dates')
const enrichPaymentRequests = require('./enrichment')
const { applyDualAccounting } = require('./dual-accounting')

const transformPaymentRequest = async (paymentRequest) => {
  // If BPS, then need to confirm payment request number as rekeyed claims can result in duplicate payment request numbers
  if (paymentRequest.schemeId === BPS) {
    paymentRequest.paymentRequestNumber = await confirmPaymentRequestNumber(paymentRequest)
  }
  // Check to see if payment request has had a previous payment request.
  // if yes, need to treat as post payment adjustment and calculate Delta which can result in payment request splitting
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)
  if (previousPaymentRequests.length) {
    const deltaPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    const confirmedPaymentRequests = confirmDueDates(deltaPaymentRequests.completedPaymentRequests, previousPaymentRequests)
    deltaPaymentRequests.completedPaymentRequests = enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)
    deltaPaymentRequests.completedPaymentRequests = applyDualAccounting(deltaPaymentRequests.completedPaymentRequests, previousPaymentRequests)

    return deltaPaymentRequests
  }
  // otherwise first payment request doesn't require delta calculation, so return with dual accounting applied
  const appliedPaymentRequests = applyDualAccounting([paymentRequest], previousPaymentRequests)
  return { completedPaymentRequests: appliedPaymentRequests }
}

module.exports = transformPaymentRequest
