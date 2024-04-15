const db = require('../../data')

const removeSchedule = async (nonScheduledPaymentRequests, started, transaction) => {
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
  removeSchedule
}
