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
      submitted: null,
      awaitingEnrichment: false
    },
    order: ['paymentRequestId'],
    raw: true,
    nest: true
  })
  return paymentRequests.map(removeNullProperties)
}

const removeNullProperties = (paymentRequest) => {
  return JSON.parse(JSON.stringify(paymentRequest, (key, value) => (value === null ? undefined : value)))
}

module.exports = getPendingPaymentRequests
