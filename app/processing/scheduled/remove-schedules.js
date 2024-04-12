const db = require('../../data')

const removeSchedules = async (paymentRequests, scheduledPaymentRequests, transaction) => {
  const nonScheduledPaymentRequests = paymentRequests.filter(paymentRequest => {
    return !scheduledPaymentRequests.some(scheduledRequest => scheduledRequest.scheduleId === paymentRequest.scheduleId)
  })
  await db.schedule.update({ started: null }, {
    where: {
      scheduleId: {
        [db.Sequelize.Op.in]: [...nonScheduledPaymentRequests.map(x => x.scheduleId)]
      }
    },
    transaction
  })
}

module.exports = {
  removeSchedules
}
