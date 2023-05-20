const { TIMESTAMP } = require('../mocks/values/date')

const settlePaymentRequest = (paymentRequest, value, lastSettlement) => {
  paymentRequest.settledValue = value ?? paymentRequest.value
  paymentRequest.lastSettlement = lastSettlement ?? TIMESTAMP
}

module.exports = {
  settlePaymentRequest
}
