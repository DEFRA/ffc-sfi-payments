const db = require('../data')

const createSchedule = async (paymentRequestId, transaction) => {
  await db.schedule.create({
    paymentRequestId,
    planned: new Date()
  },
  { transaction })
}

module.exports = {
  createSchedule
}
