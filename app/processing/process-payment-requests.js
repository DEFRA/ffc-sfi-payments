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
  const { scheduleId, paymentRequest } = scheduledPaymentRequest
  const paymentRequests = await transformPaymentRequest(paymentRequest)
  const { deltaPaymentRequest, completedPaymentRequests } = paymentRequests
  // If has AR but no debt enrichment data, then route to request editor and apply hold
  if (requiresDebtData(completedPaymentRequests)) {
    await routeDebtToRequestEditor(paymentRequest)
  } else if (config.useManualLedgerCheck && deltaPaymentRequest && requiresManualLedgerCheck(deltaPaymentRequest)) {
    await routeManualLedgerToRequestEditor(paymentRequests)
  } else {
    for (const completedPaymentRequest of completedPaymentRequests) {
      await mapAccountCodes(completedPaymentRequest)
    }
    await completePaymentRequests(scheduleId, completedPaymentRequests)
  }
}

module.exports = processPaymentRequests
