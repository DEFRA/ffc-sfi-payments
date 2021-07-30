const db = require('../data')
const moment = require('moment')
const config = require('../config')

const getPaymentRequests = async () => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequests = await getScheduledPaymentRequests(transaction)
    const holds = await getHolds(transaction)
    const paymentRequestsWithoutHolds = removeHolds(paymentRequests, holds)
    const uniquePaymentRequests = removeDuplicates(paymentRequestsWithoutHolds)
    const cappedPaymentRequests = restrictToBatchSize(uniquePaymentRequests)
    await updateScheduled(cappedPaymentRequests, transaction)
    await transaction.commit()
    return cappedPaymentRequests
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

const getScheduledPaymentRequests = async (transaction) => {
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
      planned: { [db.Sequelize.Op.lte]: new Date() },
      completed: null,
      [db.Sequelize.Op.or]: [{
        started: null
      }, {
        started: { [db.Sequelize.Op.lte]: moment().subtract(5, 'minutes').toDate() }
      }]
    }
  })
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

const removeHolds = (scheduledPaymentRequests, holds) => {
  return scheduledPaymentRequests.filter(x =>
    !holds.some(y => y.holdCategory.schemeId === x.paymentRequest.schemeId && y.frn === x.paymentRequest.frn))
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
  return scheduledPaymentRequests.slice(0, config.processingBatchSize)
}

const updateScheduled = async (scheduledPaymentRequests, transaction) => {
  const started = new Date()
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
