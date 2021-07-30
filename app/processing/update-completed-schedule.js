const db = require('../data')

const updateCompletedSchedule = async (scheduleId) => {
  return db.schedule.update({ completed: new Date() }, { where: { scheduleId } })
}

module.exports = updateCompletedSchedule
