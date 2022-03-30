const { addHold } = require('../holds')
const createSchedule = require('../inbound/create-schedule')
const abandonSchedule = require('./abandon-schedule')
const getExistingHold = require('./get-existing-hold.js')
const getExistingSchedule = require('./get-existing-schedule')

const holdAndReschedule = async (schemeId, paymentRequestId, holdCategoryId, frn, transaction) => {
  const existingHold = await getExistingHold(holdCategoryId, frn, transaction)
  if (!existingHold) {
    await addHold(frn, holdCategoryId, transaction)
  }
  const existingSchedule = await getExistingSchedule(paymentRequestId, transaction)
  if (!existingSchedule) {
    await createSchedule(schemeId, paymentRequestId, transaction)
  } else {
    await abandonSchedule(existingSchedule.scheduleId, transaction)
  }
}

module.exports = holdAndReschedule
