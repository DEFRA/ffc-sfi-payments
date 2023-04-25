const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const enrichPaymentRequests = require('../processing/enrichment')
const confirmDueDates = require('../processing/confirm-due-dates')
const getCompletedPaymentRequests = require('../processing/get-completed-payment-requests')
const completePaymentRequests = require('../processing/complete-payment-requests')
const mapAccountCodes = require('../processing/map-account-codes')
const { sendProcessingRouteEvent } = require('../event')

const updateRequestsAwaitingManualLedgerCheck = async (paymentRequest) => {
  const orginalPaymentRequest = paymentRequest.paymentRequest

  const checkPaymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber: orginalPaymentRequest.invoiceNumber } })
  if (!checkPaymentRequest) {
    throw new Error(`No payment request matching invoice number: ${paymentRequest.invoiceNumber}`)
  }

  const paymentRequestId = checkPaymentRequest.paymentRequestId
  const schedule = await getScheduleId(paymentRequestId)

  if (schedule) {
    const scheduleId = schedule.scheduleId
    const paymentRequests = await transformPaymentRequest(orginalPaymentRequest, paymentRequest.paymentRequests)

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
    await removeHold(checkPaymentRequest.schemeId, checkPaymentRequest.frn)

    for (const paymentRequestItem of updatedPaymentRequests) {
      await sendProcessingRouteEvent(paymentRequestItem, 'manual-ledger', 'response')
    }
  }
}

const transformPaymentRequest = async (paymentRequest, paymentRequests) => {
  const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest)
  const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
  paymentRequests = enrichPaymentRequests(confirmedPaymentRequests, previousPaymentRequests)
  return paymentRequests
}

const getScheduleId = async (paymentRequestId) => {
  return db.schedule.findOne({ where: { paymentRequestId, completed: null } })
}

const removeHold = async (schemeId, frn) => {
  const holdCategoryId = await getHoldCategoryId(schemeId, 'Manual ledger hold')
  await db.hold.update({ closed: new Date() }, { where: { frn, holdCategoryId } })
}

module.exports = updateRequestsAwaitingManualLedgerCheck
