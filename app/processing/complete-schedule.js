const db = require('../data')

const completeSchedule = async (scheduleId) => {
  return db.schedule.update({ completed: new Date() }, { where: { scheduleId } })
}

module.exports = completeSchedule
