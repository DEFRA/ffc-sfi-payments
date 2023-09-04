const { MANUAL, ES, IMPS, FC, SFI } = require('../constants/schemes')
const { completePaymentRequests } = require('./complete-payment-requests')
const { transformPaymentRequest } = require('./transform-payment-request')
const { applyAutoHold } = require('./auto-hold')
const { requiresDebtData } = require('./requires-debt-data')
const { routeDebtToRequestEditor, routeManualLedgerToRequestEditor } = require('../routing')
const { sendProcessingRouteEvent } = require('../event')
const { requiresManualLedgerCheck } = require('./requires-manual-ledger-check')
const { mapAccountCodes } = require('./account-codes')
const { getClosedFRN } = require('./get-closed-frn');
const { removeDuplicates } = require('./scheduled/remove-duplicates')
const config = require('../config/processing')

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const { scheduleId, paymentRequest } = scheduledPaymentRequest

  if ([MANUAL, ES, IMPS, FC].includes(paymentRequest.schemeId)) {
    await completePaymentRequests(scheduleId, [paymentRequest])
    return
  }

  const paymentRequests = await transformPaymentRequest(paymentRequest)
  const { deltaPaymentRequest, completedPaymentRequests } = paymentRequests

  // if FRN is closed (SFI only), remove AR
  if (paymentRequest.schemeId === SFI && config.handleSFIClosures) {
    const closedFRN = await getClosedFRN(paymentRequest.frn)
    if (closedFRN !== null) {
      console.log(`FRN ${paymentRequest.frn} has been closed, skipping request editor and holds`)
      await mapAndComplete(scheduleId, completedPaymentRequests)
      return
    }
  }

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

  await mapAndComplete(scheduleId, completedPaymentRequests)
}

const mapAndComplete = async (scheduleId, paymentRequests) => {
  for (const completedPaymentRequest of paymentRequests) {
    await mapAccountCodes(completedPaymentRequest)
  }
  await completePaymentRequests(scheduleId, paymentRequests)
}

module.exports = {
  processPaymentRequest
}
