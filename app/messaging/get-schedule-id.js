const db = require('../data')

const getScheduleId = async (paymentRequestId) => {
  return db.schedule.findOne({ where: { paymentRequestId, completed: null } })
}

module.exports = {
  getScheduleId
}
