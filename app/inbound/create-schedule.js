const db = require('../data')

const createSchedule = async (schemeId, paymentRequestId, transaction) => {
  await db.schedule.create({
    schemeId,
    paymentRequestId,
    planned: new Date()
  },
  { transaction })
}

module.exports = {
  createSchedule
}
