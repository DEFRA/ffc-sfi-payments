const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const completePaymentRequests = require('../processing/complete-payment-requests')

const updateRequestsAwaitingDebtData = async (paymentRequest) => {
  const scheduleId = paymentRequest.scheduleId
  const paymentRequests = paymentRequest.paymentRequests
  const orginalPaymentRequest = paymentRequest.paymentRequest
  await prepareForReprocessing(orginalPaymentRequest)
  await completePaymentRequests(scheduleId, paymentRequests)
}

const prepareForReprocessing = async (paymentRequest) => {
  await removeHold(paymentRequest.schemeId, paymentRequest.frn)
}

async function removeHold (schemeId, frn) {
  const holdCategoryId = await getHoldCategoryId(schemeId, 'Manual ledger hold')
  await db.hold.update({ closed: new Date() }, { where: { frn, holdCategoryId } })
}

module.exports = updateRequestsAwaitingDebtData
