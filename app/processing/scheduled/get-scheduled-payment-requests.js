const moment = require('moment')
const db = require('../../data')
const { getHolds } = require('./get-holds')

const getScheduledPaymentRequests = async (started, transaction) => {
  const schedules = await db.schedule.findAll({
    transaction,
    lock: true,
    skipLocked: true,
    raw: true,
    order: ['planned'],
    where: {
      planned: { [db.Sequelize.Op.lte]: started },
      completed: null,
      [db.Sequelize.Op.or]: [{
        started: null
      }, {
        started: { [db.Sequelize.Op.lte]: moment(started).subtract(5, 'minutes').toDate() }
      }]
    }
  })

  const schemes = await db.scheme.findAll({
    transaction,
    raw: true,
    where: {
      active: true
    }
  })

  const holds = await getHolds(transaction)

  const activeSchedules = []

  for (const schedule of schedules) {
    schedule.paymentRequest = await db.paymentRequest.findOne({
      raw: true,
      transaction,
      where: {
        paymentRequestId: schedule.paymentRequestId
      }
    })

    if (schedule.paymentRequest && schemes.some(x => x.schemeId === schedule.paymentRequest.schemeId) &&
    !holds.some(y => y.holdCategory.schemeId === schedule.paymentRequest.schemeId && y.frn === schedule.paymentRequest.frn)
    ) {
      schedule.paymentRequest.invoiceLines = await db.invoiceLine.findAll({
        transaction,
        where: {
          paymentRequestId: schedule.paymentRequestId,
          invalid: { [db.Sequelize.Op.ne]: true }
        },
        raw: true
      })

      if (schedule.paymentRequest.invoiceLines.length) {
        activeSchedules.push(schedule)
      }
    }
  }

  return activeSchedules.sort((a, b) => { return sortArray(a.paymentRequest.paymentRequestNumber, b.paymentRequest.paymentRequestNumber) || sortArray(a.planned, b.planned) })
}

const sortArray = (a, b) => {
  const order = a < b ? -1 : 1
  return a === b ? 0 : order
}

module.exports = {
  getScheduledPaymentRequests
}
