const db = require('../data')
const { getCompletedPaymentRequestsFilter } = require('./get-completed-payment-requests-filter')

const getCompletedPaymentRequests = async (paymentRequest) => {
  const filter = getCompletedPaymentRequestsFilter(paymentRequest)
  const completedPaymentRequests = await db.completedPaymentRequest.findAll({
    where: {
      ...filter,
      paymentRequestNumber: { [db.Sequelize.Op.lt]: paymentRequest.paymentRequestNumber },
      invalid: false
    },
    order: [['paymentRequestNumber', 'ASC']],
    include: [{
      model: db.completedInvoiceLine,
      as: 'invoiceLines'
    }]
  })

  return completedPaymentRequests.map(x => x.get({ plain: true }))
}

module.exports = getCompletedPaymentRequests
