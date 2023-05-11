const db = require('../data')
const { removeHold } = require('./remove-hold')
const { completePaymentRequests } = require('../processing/complete-payment-requests')
const { mapAccountCodes } = require('../processing/account-codes/map-account-codes')
const { sendProcessingRouteEvent } = require('../event')
const { getScheduleId } = require('./get-schedule-id')
const { transformPaymentRequest } = require('./transform-payment-request')

const updateRequestsAwaitingManualLedgerCheck = async (paymentRequest) => {
  const originalPaymentRequest = paymentRequest.paymentRequest

  const checkPaymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber: originalPaymentRequest.invoiceNumber } })
  if (!checkPaymentRequest) {
    throw new Error(`No payment request matching invoice number: ${paymentRequest.invoiceNumber}`)
  }

  const paymentRequestId = checkPaymentRequest.paymentRequestId
  const schedule = await getScheduleId(paymentRequestId)

  if (schedule) {
    const scheduleId = schedule.scheduleId
    const paymentRequests = await transformPaymentRequest(originalPaymentRequest, paymentRequest.paymentRequests)

    // Mapping account codes need to be re-calculated on processing of a manual ledger check
    for (const paymentRequestItem of paymentRequests) {
      await mapAccountCodes(paymentRequestItem)
    }

    const updatedPaymentRequests = paymentRequests.map(x => {
      x.correlationId = checkPaymentRequest.correlationId
      x.paymentRequestId = paymentRequestId
      return x
    })

    await completePaymentRequests(scheduleId, updatedPaymentRequests)
    await removeHold(checkPaymentRequest.schemeId, checkPaymentRequest.frn, 'Manual ledger hold')

    for (const paymentRequestItem of updatedPaymentRequests) {
      await sendProcessingRouteEvent(paymentRequestItem, 'manual-ledger', 'response')
    }
  }
}

module.exports = {
  updateRequestsAwaitingManualLedgerCheck
}
