const db = require('../data')

const abandonSchedule = async (scheduleId, transaction) => {
  await db.schedule.update({ started: null }, { where: { scheduleId, completed: null }, transaction })
}

module.exports = {
  abandonSchedule
}
