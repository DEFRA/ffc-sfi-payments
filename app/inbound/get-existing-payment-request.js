const db = require('../data')

const getExistingPaymentRequest = async (paymentRequest, transaction) => {
  return db.paymentRequest.findOne({
    transaction,
    lock: true,
    skipLocked: true,
    where: {
      agreementNumber: paymentRequest.agreementNumber,
      paymentRequestNumber: paymentRequest.paymentRequestNumber,
      marketingYear: paymentRequest.marketingYear
    }
  })
}

module.exports = getExistingPaymentRequest
