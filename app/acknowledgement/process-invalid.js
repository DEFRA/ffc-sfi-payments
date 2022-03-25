const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const getHoldCategoryName = require('./get-hold-category-name')
const invalidatePaymentRequests = require('./invalidate-payment-requests')
const holdAndReschedule = require('../reschedule')
const resetReferenceId = require('./reset-reference-id')

const processInvalid = async (schemeId, paymentRequestId, frn, message) => {
  const transaction = await db.sequelize.transaction()
  try {
    await resetReferenceId(paymentRequestId, transaction)
    await invalidatePaymentRequests(paymentRequestId, transaction)
    const holdCategoryName = getHoldCategoryName(message)
    const holdCategoryId = await getHoldCategoryId(schemeId, holdCategoryName, transaction)
    await holdAndReschedule(schemeId, paymentRequestId, holdCategoryId, frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processInvalid
