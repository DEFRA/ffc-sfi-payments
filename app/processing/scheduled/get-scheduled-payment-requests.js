const { Transaction } = require('sequelize')
const db = require('../../data')
const { processingConfig } = require('../../config')
const getScheduledPaymentRequestsQuery = require('../../constants/get-scheduled-payment-requests-query')

const getScheduledPaymentRequests = async () => {
  // This is written as a raw query for performance reasons
  const transaction = await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })
  try {
    const schedules = await determineSchedules(transaction)

    await transaction.commit()

    const scheduledPaymentRequests = await db.schedule.findAll({
      include: [{
        model: db.paymentRequest,
        as: 'paymentRequest',
        include: [{
          model: db.invoiceLine,
          as: 'invoiceLines',
          required: true,
          where: {
            invalid: { [db.Sequelize.Op.ne]: true }
          }
        }, {
          model: db.scheme,
          as: 'scheme'
        }]
      }],
      where: {
        scheduleId: {
          [db.Sequelize.Op.in]: [...schedules[0].map(x => x.scheduleId)]
        }
      }
    })
    return scheduledPaymentRequests.map(x => x.get({ plain: true })).filter(x => x.paymentRequest)
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const determineSchedules = async (transaction) => {
  return db.sequelize.query(getScheduledPaymentRequestsQuery, {
    replacements: {
      processingCap: processingConfig.processingCap
    },
    raw: true,
    transaction
  })
}

module.exports = {
  getScheduledPaymentRequests
}
