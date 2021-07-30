const db = require('../data')
const moment = require('moment')
const processingBatchSize = 100

const processPendingPaymentRequests = async () => {
  const scheduledPaymentRequests = await getScheduledPaymentRequests()
  console.log(scheduledPaymentRequests)
}

const getScheduledPaymentRequests = () => {
  return db.schedule.findAll({
    order: ['planned'],
    limit: processingBatchSize,
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

module.exports = processPendingPaymentRequests
