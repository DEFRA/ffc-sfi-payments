const db = require('../data')

const acknowledgePaymentRequest = async (invoiceNumber, acknowledged) => {
  return db.completedPaymentRequest.update({ acknowledged }, { where: { invoiceNumber } })
}

module.exports = acknowledgePaymentRequest
