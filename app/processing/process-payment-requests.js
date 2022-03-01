const config = require('../config')
const getPaymentRequests = require('./get-payment-requests')
const mapAccountCodes = require('./map-account-codes')
const completePaymentRequests = require('./complete-payment-requests')
const transformPaymentRequest = require('./transform-payment-request')
const requiresDebtData = require('./requires-debt-data')
const routeDebtToRequestEditor = require('./route-debt-to-request-editor')
const requiresManualLedgerCheck = require('./requires-manual-ledger-check')
const routeManualLedgerToRequestEditor = require('./route-manual-ledger-to-request-editor')

const processPaymentRequests = async () => {
  const scheduledPaymentRequests = await getPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
  }
}

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const paymentRequests = await transformPaymentRequest(scheduledPaymentRequest.paymentRequest)

  // If has AR but no debt enrichment data, then route to request editor and apply hold
  if (requiresDebtData(paymentRequests)) {
    await routeDebtToRequestEditor(scheduledPaymentRequest.paymentRequest)
  } else {
    for (const paymentRequest of paymentRequests) {
      await mapAccountCodes(paymentRequest)
    }

    // if (config.useManualLedgerCheck && requiresManualLedgerCheck(paymentRequests)) {
    // the payment request after delta (ie values updated) as well as the completed payment request must be sent in the same message
    await routeManualLedgerToRequestEditor(scheduledPaymentRequest.paymentRequest)

    await completePaymentRequests(scheduledPaymentRequest.scheduleId, paymentRequests)
  }
}

module.exports = processPaymentRequests
