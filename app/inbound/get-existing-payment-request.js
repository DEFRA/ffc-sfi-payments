const db = require('../data')

const getExistingPaymentRequest = async (invoiceNumber, transaction) => {
  return db.paymentRequest.findOne({
    attributes: ['paymentRequestId', 'invoiceNumber'],
    transaction,
    where: {
      invoiceNumber
    }
  })
}

module.exports = {
  getExistingPaymentRequest
}
