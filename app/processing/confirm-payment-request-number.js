const db = require('../data')

const confirmPaymentRequestNumber = async (paymentRequest) => {
  if (paymentRequest.paymentRequestNumber > 1) {
    return paymentRequest.paymentRequestNumber
  }
  const completedPaymentRequest = await db.completedPaymentRequest.findOne({
    attributes: ['paymentRequestNumber'],
    where: {
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear,
      invalid: false
    },
    order: [['paymentRequestNumber', 'DESC']]
  })
  if (completedPaymentRequest) {
    return completedPaymentRequest.paymentRequestNumber + 1
  }
  return paymentRequest.paymentRequestNumber
}

module.exports = {
  confirmPaymentRequestNumber
}
