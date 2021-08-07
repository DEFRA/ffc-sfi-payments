const db = require('../data')

const getExistingPaymentRequest = async (paymentRequest, transaction) => {
  return await db.paymentRequest.findOne({
    transaction,
    where: {
      agreementNumber: paymentRequest.agreementNumber,
      paymentRequestNumber: paymentRequest.paymentRequestNumber,
      marketingYear: paymentRequest.marketingYear
    }
  })
}

module.exports = getExistingPaymentRequest
