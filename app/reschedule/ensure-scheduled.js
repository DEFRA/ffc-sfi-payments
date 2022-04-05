const createSchedule = require('../inbound/create-schedule')
const abandonSchedule = require('./abandon-schedule')
const getExistingSchedule = require('./get-existing-schedule')

const ensureScheduled = async (paymentRequestId, schemeId, transaction) => {
  const existingSchedule = await getExistingSchedule(paymentRequestId, transaction)
  if (!existingSchedule) {
    await createSchedule(schemeId, paymentRequestId, transaction)
  } else {
    await abandonSchedule(existingSchedule.scheduleId, transaction)
  }
}

module.exports = ensureScheduled
