const db = require('../data')

const getPendingPaymentRequests = async (transaction) => {
  return db.completedPaymentRequest.findAll({
    transaction,
    lock: true,
    skipLocked: true,
    include: [{
      model: db.completedInvoiceLine,
      as: 'invoiceLines',
      required: true
    }],
    where: {
      submitted: null
    },
    order: ['paymentRequestId']
  })
}

module.exports = getPendingPaymentRequests
