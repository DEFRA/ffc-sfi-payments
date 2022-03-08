const getPaymentRequests = require('./get-payment-requests')
const mapAccountCodes = require('./map-account-codes')
const completePaymentRequests = require('./complete-payment-requests')
const transformPaymentRequest = require('./transform-payment-request')
const routeToRequestEditor = require('./route-to-request-editor')
const requiresDebtData = require('./requires-debt-data')
const applyAutoHold = require('./apply-auto-hold')

const processPaymentRequests = async () => {
  const scheduledPaymentRequests = await getPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
  }
}

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const paymentRequests = await transformPaymentRequest(scheduledPaymentRequest.paymentRequest)

  if (await applyAutoHold(paymentRequests)) {
    return
  }

  // If has AR but no debt enrichment data, then route to request editor and apply hold
  if (requiresDebtData(paymentRequests)) {
    await routeToRequestEditor(scheduledPaymentRequest.paymentRequest)
    return
  }

  for (const paymentRequest of paymentRequests) {
    await mapAccountCodes(paymentRequest)
  }
  await completePaymentRequests(scheduledPaymentRequest.scheduleId, paymentRequests)
}

module.exports = processPaymentRequests
