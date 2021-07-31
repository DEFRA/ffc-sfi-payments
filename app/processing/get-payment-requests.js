const db = require('../data')
const moment = require('moment')
const config = require('../config')

const getPaymentRequests = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequests = await getScheduledPaymentRequests(started, transaction)
    const paymentRequestsWithoutPending = await removePending(paymentRequests, started, transaction)
    const paymentRequestsWithoutHolds = await removeHolds(paymentRequestsWithoutPending, transaction)
    const uniquePaymentRequests = removeDuplicates(paymentRequestsWithoutHolds)
    const cappedPaymentRequests = restrictToBatchSize(uniquePaymentRequests)
    await updateScheduled(cappedPaymentRequests, started, transaction)
    await transaction.commit()
    return cappedPaymentRequests
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

const getScheduledPaymentRequests = async (started, transaction) => {
  return db.schedule.findAll({
    transaction,
    order: ['planned'],
    include: [{
      model: db.paymentRequest,
      as: 'paymentRequest',
      required: true,
      include: [{
        model: db.invoiceLine,
        as: 'invoiceLines',
        required: true
      }, {
        model: db.scheme,
        as: 'scheme',
        required: true
      }]
    }],
    where: {
      '$paymentRequest.scheme.active$': true,
      planned: { [db.Sequelize.Op.lte]: started },
      completed: null,
      [db.Sequelize.Op.or]: [{
        started: null
      }, {
        started: { [db.Sequelize.Op.lte]: moment(started).subtract(5, 'minutes').toDate() }
      }]
    }
  })
}

const removePending = async (scheduledPaymentRequests, started, transaction) => {
  const pending = await getPending(started, transaction)
  return scheduledPaymentRequests.filter(x =>
    !pending.some(y => y.paymentRequest.schemeId === x.paymentRequest.schemeId && y.paymentRequest.frn === x.paymentRequest.frn && y.paymentRequest.marketingYear === x.paymentRequest.marketingYear))
}

const getPending = async (started, transaction) => {
  return db.schedule.findAll({
    where: {
      completed: null,
      started: { [db.Sequelize.Op.gt]: moment(started).subtract(5, 'minutes').toDate() }
    },
    include: [{
      model: db.paymentRequest,
      as: 'paymentRequest'
    }],
    transaction
  })
}

const removeHolds = async (scheduledPaymentRequests, transaction) => {
  const holds = await getHolds(transaction)
  return scheduledPaymentRequests.filter(x =>
    !holds.some(y => y.holdCategory.schemeId === x.paymentRequest.schemeId && y.frn === x.paymentRequest.frn))
}

const getHolds = async (transaction) => {
  return db.hold.findAll({
    where: { closed: null },
    include: [{
      model: db.holdCategory,
      as: 'holdCategory'
    }],
    transaction
  })
}

const removeDuplicates = (scheduledPaymentRequests) => {
  return scheduledPaymentRequests.reduce((x, y) => {
    const isDuplicate = (currentSchedule) => {
      return x.some((schedule) => {
        return (schedule.paymentRequest.schemeId === currentSchedule.paymentRequest.schemeId &&
          schedule.paymentRequest.frn === currentSchedule.paymentRequest.frn &&
          schedule.paymentRequest.marketingYear === currentSchedule.paymentRequest.marketingYear)
      })
    }

    if (isDuplicate(y)) {
      return x
    } else {
      return [...x, y]
    }
  }, [])
}

const restrictToBatchSize = (scheduledPaymentRequests) => {
  return scheduledPaymentRequests.slice(0, config.processingCap)
}

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

module.exports = getPaymentRequests
