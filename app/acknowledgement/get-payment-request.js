const db = require('../data')

const getPaymentRequest = async (invoiceNumber) => {
  return db.completedPaymentRequest.findOne({ where: { invoiceNumber } })
}

module.exports = {
  getPaymentRequest
}
