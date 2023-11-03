const db = require('../data')
const { removeNullProperties } = require('../remove-null-properties')
const { processingConfig } = require('../config')

const getPendingPaymentRequests = async (transaction) => {
  const paymentRequests = await db.completedPaymentRequest.findAll({
    transaction,
    lock: true,
    skipLocked: true,
    limit: processingConfig.processingCap,
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

module.exports = {
  getPendingPaymentRequests
}
