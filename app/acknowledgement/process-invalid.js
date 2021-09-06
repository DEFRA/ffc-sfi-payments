const db = require('../data')
const { addHold } = require('../holds')
const createSchedule = require('../inbound/create-schedule')
const getExistingHold = require('./get-existing-hold.js')
const getExistingSchedule = require('./get-existing-schedule')
const getHoldCategoryId = require('./get-hold-category-id')
const getHoldCategoryName = require('./get-hold-category-name')
const invalidatePaymentRequests = require('./invalidate-payment-requests')

const processInvalid = async (schemeId, paymentRequestId, frn, message) => {
  const transaction = await db.sequelize.transaction()
  try {
    await invalidatePaymentRequests(paymentRequestId, transaction)
    const holdCategoryName = getHoldCategoryName(message)
    const holdCategoryId = await getHoldCategoryId(schemeId, holdCategoryName, transaction)
    const existingHold = await getExistingHold(holdCategoryId, frn)
    if (!existingHold) {
      await addHold(frn, holdCategoryId)
      const existingSchedule = await getExistingSchedule(paymentRequestId, transaction)
      if (!existingSchedule) {
        await createSchedule(schemeId, paymentRequestId)
      }
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processInvalid
