const getCompletedPaymentRequests = require('./get-completed-payment-requests')
const calculateDelta = require('./delta')
const confirmDueDates = require('./confirm-due-dates')
const enrichPaymentRequests = require('./enrichment')
// const applyDualAccounting = require('./apply-dual-accounting')

const transformPaymentRequest = async (paymentRequest) => {
  // Check to see if payment request has had a previous payment request.
  // if yes, need to treat as post payment adjustment and calculate Delta which can result in payment request splitting
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear, paymentRequest.agreementNumber, paymentRequest.paymentRequestNumber)
  if (previousPaymentRequests.length) {
    const deltaPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    const confirmedPaymentRequests = confirmDueDates(deltaPaymentRequests.completedPaymentRequests, previousPaymentRequests)
    deltaPaymentRequests.completedPaymentRequests = enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)
    // deltaPaymentRequests.completedPaymentRequests = applyDualAccounting(deltaPaymentRequests, previousPaymentRequests)

    return deltaPaymentRequests
  }
  // otherwise original payment request does not require further processing so can be returned without modification
  // paymentRequest = applyDualAccounting(paymentRequest, previousPaymentRequests)
  return { completedPaymentRequests: [paymentRequest] }
}

module.exports = transformPaymentRequest
