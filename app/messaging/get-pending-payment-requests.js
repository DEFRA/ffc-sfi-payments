const db = require('../data')

const getPendingPaymentRequests = async (transaction) => {
  return db.scheme.findAll({
    transaction,
    lock: true,
    skipLocked: true,
    include: [{
      model: db.completedPaymentRequest,
      as: 'completedPaymentRequests',
      required: true,
      include: [{
        model: db.invoiceLine,
        as: 'invoiceLines',
        required: true
      }],
      where: {
        submitted: null
      },
      order: ['paymentRequestId']
    }]
  })
}

module.exports = getPendingPaymentRequests
