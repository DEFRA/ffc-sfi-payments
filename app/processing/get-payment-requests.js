const db = require('../data')
const moment = require('moment')
const config = require('../config')

const getPaymentRequests = async () => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequests = await getScheduledPaymentRequests(transaction)
    const holds = await getHolds(transaction)
    const paymentRequestsWithoutHolds = removeHolds(paymentRequests, holds)
    const cappedPaymentRequests = restrictToBatchSize(paymentRequestsWithoutHolds)
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
        started: moment().subtract(5, 'minutes').toDate()
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

const restrictToBatchSize = (paymentRequests) => {
  return paymentRequests.slice(0, config.processingBatchSize)
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
