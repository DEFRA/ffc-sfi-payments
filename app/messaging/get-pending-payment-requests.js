const db = require('../data')

const getPendingPaymentRequests = async (transaction) => {
  const paymentRequests = await db.completedPaymentRequest.findAll({
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
  return paymentRequests.map(x => x.get({ plain: true })).map(removeNullProperties)
}

const removeNullProperties = (paymentRequest) => {
  return JSON.parse(JSON.stringify(paymentRequest, (_key, value) => (value === null ? undefined : value)))
}

module.exports = getPendingPaymentRequests
