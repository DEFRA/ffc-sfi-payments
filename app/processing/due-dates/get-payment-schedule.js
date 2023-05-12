const moment = require('moment')
const { getSchedule } = require('./get-schedule')
const { Q4, M12, T4 } = require('../../constants/schedules')

const getPaymentSchedule = (schedule, dueDate, settledValue, totalValue, currentDate) => {
  const scheduleDate = moment(dueDate, 'DD/MM/YYYY')

  switch (schedule) {
    case Q4:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'month', currentDate)
    case M12:
      return getSchedule(scheduleDate, 12, settledValue, totalValue, 1, 'month', currentDate)
    case T4:
      return getSchedule(scheduleDate, 4, settledValue, totalValue, 3, 'day', currentDate)
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

module.exports = {
  getPaymentSchedule
}
