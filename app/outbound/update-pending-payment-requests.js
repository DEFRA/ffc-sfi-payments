const db = require('../data')

const updatePendingPaymentRequests = async (paymentRequests, submitted, transaction) => {
  for (const paymentRequest of paymentRequests) {
    await db.completedPaymentRequest.update({ submitted }, { where: { completedPaymentRequestId: paymentRequest.completedPaymentRequestId }, transaction })
    await db.outbox.update({ submitted }, { where: { completedPaymentRequestId: paymentRequest.completedPaymentRequestId }, transaction })
  }
}

module.exports = {
  updatePendingPaymentRequests
}
