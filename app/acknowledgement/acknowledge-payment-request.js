const db = require('../data')

const test = "test"

const acknowledgePaymentRequest = async (invoiceNumber, acknowledged) => {
  await db.completedPaymentRequest.update({ acknowledged }, { where: { invoiceNumber } })
}

module.exports = {
  acknowledgePaymentRequest
}
