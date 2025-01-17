const { getExistingHold } = require('./get-existing-hold')
const { addHold } = require('./add-hold')
const { ensureScheduled } = require('../reschedule/ensure-scheduled')

const holdAndReschedule = async (paymentRequest, holdCategoryId, transaction) => {
  const existingHold = await getExistingHold(holdCategoryId, paymentRequest, transaction)
  if (!existingHold) {
    await addHold(paymentRequest, holdCategoryId, transaction)
  }
  await ensureScheduled(paymentRequest.paymentRequestId, transaction)
}

module.exports = {
  holdAndReschedule
}
