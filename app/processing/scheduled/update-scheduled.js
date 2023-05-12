const db = require('../../data')

const updateScheduled = async (scheduledPaymentRequests, started, transaction) => {
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await db.schedule.update({ started }, {
      where: {
        scheduleId: scheduledPaymentRequest.scheduleId
      },
      transaction
    })
  }
}

module.exports = {
  updateScheduled
}
