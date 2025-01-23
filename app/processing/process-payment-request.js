const { MANUAL, ES, IMPS, FC, BPS } = require('../constants/schemes')
const { completePaymentRequests } = require('./complete-payment-requests')
const { isCrossBorder } = require('./is-cross-border')
const { transformPaymentRequest } = require('./transform-payment-request')
const { applyAutoHold } = require('../auto-hold')
const { requiresDebtData } = require('./requires-debt-data')
const {
  routeDebtToRequestEditor,
  routeManualLedgerToRequestEditor,
  routeToCrossBorder
} = require('../routing')
const { sendProcessingRouteEvent } = require('../event')
const { requiresManualLedgerCheck } = require('./requires-manual-ledger-check')
const { mapAccountCodes } = require('./account-codes')
const { isAgreementClosed } = require('./is-agreement-closed')
const { suppressARPaymentRequests } = require('./suppress-ar-payment-requests')
const config = require('../config/processing')

// Helper Functions
const isManualScheme = schemeId => [MANUAL, ES, IMPS, FC].includes(schemeId)

const handleManualSchemes = async (scheduleId, paymentRequest) => {
  await completePaymentRequests(scheduleId, [paymentRequest])
}

const handleCrossBorder = async paymentRequest => {
  await sendProcessingRouteEvent(paymentRequest, 'cross-border', 'request')
  await routeToCrossBorder(paymentRequest)
}

const checkAgreementClosure = async paymentRequest => {
  return config.handleSchemeClosures
    ? await isAgreementClosed(paymentRequest)
    : false
}

const handleAgreementClosure = async (paymentRequest, paymentRequests) => {
  paymentRequests.completedPaymentRequests = await suppressARPaymentRequests(
    paymentRequest,
    paymentRequests.completedPaymentRequests
  )
}

const handleDebtData = async paymentRequest => {
  await sendProcessingRouteEvent(paymentRequest, 'debt', 'request')
  await routeDebtToRequestEditor(paymentRequest)
}

const handleManualLedger = async (paymentRequest, paymentRequests) => {
  await sendProcessingRouteEvent(paymentRequest, 'manual-ledger', 'request')
  await routeManualLedgerToRequestEditor(paymentRequests)
}

const processPaymentRequest = async scheduledPaymentRequest => {
  const { scheduleId, paymentRequest } = scheduledPaymentRequest

  if (isManualScheme(paymentRequest.schemeId)) {
    await handleManualSchemes(scheduleId, paymentRequest)
    return
  }

  if (
    paymentRequest.schemeId === BPS &&
    isCrossBorder(paymentRequest.invoiceLines)
  ) {
    await handleCrossBorder(paymentRequest)
    return
  }

  const paymentRequests = await transformPaymentRequest(paymentRequest)

  const agreementIsClosed = await checkAgreementClosure(paymentRequest)
  if (agreementIsClosed) {
    await handleAgreementClosure(paymentRequest, paymentRequests)
  }

  const { deltaPaymentRequest, completedPaymentRequests } = paymentRequests

  if (await applyAutoHold(completedPaymentRequests)) {
    return
  }

  if (!agreementIsClosed && requiresDebtData(completedPaymentRequests)) {
    await handleDebtData(paymentRequest)
    return
  }

  if (deltaPaymentRequest && !agreementIsClosed) {
    const sendToManualLedgerCheck = await requiresManualLedgerCheck(
      deltaPaymentRequest
    )
    if (sendToManualLedgerCheck) {
      await handleManualLedger(paymentRequest, paymentRequests)
      return
    }
  }

  for (const completedPaymentRequest of completedPaymentRequests) {
    mapAccountCodes(completedPaymentRequest)
  }
  await completePaymentRequests(scheduleId, completedPaymentRequests)
}

module.exports = {
  processPaymentRequest
}
