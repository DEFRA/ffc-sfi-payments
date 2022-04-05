const db = require('../data')

const invalidatePaymentRequests = async (paymentRequestId, transaction) => {
  await db.completedPaymentRequest.update({ invalid: true }, { where: { paymentRequestId }, transaction })
}

module.exports = invalidatePaymentRequests
