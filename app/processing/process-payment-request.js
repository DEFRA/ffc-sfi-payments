const { transformPaymentRequest } = require('./transform-payment-request')
const { applyAutoHold } = require('./auto-hold')
const { requiresDebtData } = require('./requires-debt-data')
const { routeDebtToRequestEditor, routeManualLedgerToRequestEditor } = require('../routing')
const { requiresManualLedgerCheck } = require('./requires-manual-ledger-check')
const { mapAccountCodes } = require('./account-codes/map-account-codes')
const { completePaymentRequests } = require('./complete-payment-requests')
const { sendProcessingRouteEvent } = require('../event')
const { MANUAL } = require('../constants/schemes')

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const { scheduleId, paymentRequest } = scheduledPaymentRequest

  if (paymentRequest.schemeId === MANUAL) {
    await completePaymentRequests(scheduleId, [paymentRequest])
    return
  }

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

module.exports = {
  processPaymentRequest
}
