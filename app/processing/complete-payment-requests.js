const db = require('../data')

const completePaymentRequest = async (scheduleId, paymentRequests) => {
  // TODO also create final payment request state in transaction
  // also check if completed already in case of duplicate processing
  return db.schedule.update({ completed: new Date() }, { where: { scheduleId } })
}

module.exports = completePaymentRequest
