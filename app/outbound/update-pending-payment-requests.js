const db = require('../data')

const updatePendingPaymentRequests = async (paymentRequests, submitted, transaction) => {
  const paymentRequestIds = paymentRequests.map(x => x.completedPaymentRequestId)
  await db.completedPaymentRequest.update({ submitted }, { where: { completedPaymentRequestId: { [db.Sequelize.Op.in]: paymentRequestIds } }, transaction })
  await db.outbox.update({ submitted }, { where: { completedPaymentRequestId: { [db.Sequelize.Op.in]: paymentRequestIds } }, transaction })
}

module.exports = {
  updatePendingPaymentRequests
}
