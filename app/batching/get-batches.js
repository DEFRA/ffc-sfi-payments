const db = require('../data')
const moment = require('moment')
const config = require('../config')

const getBatches = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const batches = await getPendingBatches(started, transaction)
    await updateStarted(batches, started, transaction)
    await transaction.commit()
    return batches
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

const getPendingBatches = async (started, transaction) => {
  return db.batch.findAll({
    transaction,
    limit: config.batchCap,
    order: ['sequence'],
    include: [{
      model: db.scheme,
      as: 'scheme',
      required: true,
      include: [{
        model: db.batchProperties,
        as: 'batchProperties',
        required: true
      }]
    }, {
      model: db.completedPaymentRequest,
      as: 'paymentRequests',
      required: true,
      include: [{
        model: db.completedInvoiceLine,
        as: 'invoiceLines',
        required: true
      }]
    }],
    where: {
      published: null,
      [db.Sequelize.Op.or]: [{
        started: null
      }, {
        started: { [db.Sequelize.Op.lte]: moment(started).subtract(5, 'minutes').toDate() }
      }]
    }
  })
}

const updateStarted = async (batches, started, transaction) => {
  for (const batch of batches) {
    await db.batch.update({ started }, {
      where: {
        batchId: batch.batchId
      },
      transaction
    })
  }
}

module.exports = getBatches
