const db = require('../../data')
const moment = require('moment')

const getScheduledPaymentRequests = async (started, transaction) => {
  // const scheduledPaymentRequests = await db.schedule.findAll({
  //   transaction,
  //   lock: true,
  //   skipLocked: true,
  //   order: [['paymentRequest', 'paymentRequestNumber'], 'planned'],
  //   include: [{
  //     model: db.paymentRequest,
  //     as: 'paymentRequest',
  //     required: true,
  //     include: [{
  //       model: db.invoiceLine,
  //       as: 'invoiceLines',
  //       required: true,
  //       where: {
  //         invalid: { [db.Sequelize.Op.ne]: true }
  //       }
  //     }, {
  //       model: db.scheme,
  //       as: 'scheme',
  //       required: true
  //     }]
  //   }],
  //   where: {
  //     '$paymentRequest.scheme.active$': true,
  //     planned: { [db.Sequelize.Op.lte]: started },
  //     completed: null,
  //     [db.Sequelize.Op.or]: [{
  //       started: null
  //     }, {
  //       started: { [db.Sequelize.Op.lte]: moment(started).subtract(5, 'minutes').toDate() }
  //     }]
  //   }
  // })

  const scheduledPaymentRequests = await db.schedule.findAll({
    transaction,
    lock: true,
    skipLocked: true,
    order: [['paymentRequest', 'paymentRequestNumber'], 'planned'],
    include: [{
      model: db.paymentRequest,
      as: 'paymentRequest',
      required: true,
      include: [{
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

  const plainScheduledPaymentRequests = scheduledPaymentRequests.map(x => x.get({ plain: true }))

  // splitting for performance reasons
  for (const plainScheduledPaymentRequest of plainScheduledPaymentRequests) {
    plainScheduledPaymentRequest.paymentRequest.invoiceLines = await db.invoiceLine.findAll({
      transaction,
      where: {
        paymentRequestId: plainScheduledPaymentRequest.paymentRequest.paymentRequestId,
        invalid: { [db.Sequelize.Op.ne]: true }
      },
      raw: true
    })
  }

  return plainScheduledPaymentRequests.filter(x => x.paymentRequest.invoiceLines.length)
}

module.exports = {
  getScheduledPaymentRequests
}
