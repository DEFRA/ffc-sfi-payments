const getPaymentRequests = require('./get-payment-requests')
const transformPaymentRequest = require('./transform-payment-request')
const applyAutoHold = require('./apply-auto-hold')
const requiresDebtData = require('./requires-debt-data')
const routeDebtToRequestEditor = require('./route-debt-to-request-editor')
const requiresManualLedgerCheck = require('./requires-manual-ledger-check')
const routeManualLedgerToRequestEditor = require('./route-manual-ledger-to-request-editor')
const mapAccountCodes = require('./map-account-codes')
const completePaymentRequests = require('./complete-payment-requests')

const { sendProcessingRouteEvent } = require('../event')

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
  if (await applyAutoHold(completedPaymentRequests)) {
    return
  }
  // If has AR but no debt enrichment data, then route to request editor and apply hold
  if (requiresDebtData(completedPaymentRequests)) {
    await sendProcessingRouteEvent(paymentRequest, 'debt', 'request')
    await routeDebtToRequestEditor(paymentRequest)
    return
  }

  if (deltaPaymentRequest) {
    const sendToManualLedgerCheck = await requiresManualLedgerCheck(deltaPaymentRequest)

    if (sendToManualLedgerCheck) {
      await sendProcessingRouteEvent(paymentRequest, 'manual-ledger', 'request')
      await routeManualLedgerToRequestEditor(paymentRequests)
      return
    }
  }

  for (const completedPaymentRequest of completedPaymentRequests) {
    await mapAccountCodes(completedPaymentRequest)
  }
  await completePaymentRequests(scheduleId, completedPaymentRequests)
}

module.exports = processPaymentRequests
