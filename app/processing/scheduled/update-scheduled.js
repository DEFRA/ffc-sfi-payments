const db = require('../../data')

const updateScheduled = async (scheduledPaymentRequests, started, transaction) => {
  await db.schedule.update({ started }, {
    where: {
      scheduleId: {
        [db.Sequelize.Op.in]: [...scheduledPaymentRequests.map(x => x.scheduleId)]
      }
    },
    transaction
  })
}

module.exports = {
  updateScheduled
}
