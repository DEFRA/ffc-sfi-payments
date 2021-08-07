const schema = require('./schemas/payment-request')

const validatePaymentRequest = (paymentRequest) => {
  const validationResult = schema.validate(paymentRequest)
  if (validationResult.error) {
    throw new Error(`Payment request is invalid. ${validationResult.error.message}`)
  }
}

module.exports = validatePaymentRequest
