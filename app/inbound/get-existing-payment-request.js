const db = require('../data')

const getExistingPaymentRequest = async (invoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    where: {
      invoiceNumber
    }
  })
}

module.exports = {
  getExistingPaymentRequest
}
