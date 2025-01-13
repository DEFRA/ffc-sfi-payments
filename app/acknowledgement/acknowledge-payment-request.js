const db_test = require('../data')

const acknowledgePaymentRequest = async (invoiceNumber, acknowledged) => {
  await db_test.completedPaymentRequest.update({ acknowledged }, { where: { invoiceNumber } })
}

module.exports = {
  acknowledgePaymentRequest
}
