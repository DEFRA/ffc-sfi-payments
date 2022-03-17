const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const completePaymentRequests = require('../processing/complete-payment-requests')
const mapAccountCodes = require('../processing/map-account-codes')

const updateRequestsAwaitingManualLedgerCheck = async (paymentRequest) => {
  const orginalPaymentRequest = paymentRequest.paymentRequest

  const checkPaymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber: orginalPaymentRequest.invoiceNumber } })
  if (!checkPaymentRequest) {
    throw new Error(`No payment request matching invoice number: ${paymentRequest.invoiceNumber}`)
  }

  const { scheduleId, paymentRequests } = paymentRequest

  // Mapping account codes need to be re-calculated on processing of a manual ledger check
  for (const paymentRequestItem of paymentRequests) {
    await mapAccountCodes(paymentRequestItem)
  }

  await completePaymentRequests(scheduleId, paymentRequests)
  await removeHold(paymentRequest.schemeId, paymentRequest.frn)
}

async function removeHold (schemeId, frn) {
  const holdCategoryId = await getHoldCategoryId(schemeId, 'Manual ledger hold')
  await db.hold.update({ closed: new Date() }, { where: { frn, holdCategoryId } })
}

module.exports = updateRequestsAwaitingManualLedgerCheck
