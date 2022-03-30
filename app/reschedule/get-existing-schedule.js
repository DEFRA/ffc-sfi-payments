const db = require('../data')

const getExistingSchedule = async (paymentRequestId, transaction) => {
  return db.schedule.findOne({
    transaction,
    lock: true,
    where: { paymentRequestId, completed: null }
  })
}

module.exports = getExistingSchedule
