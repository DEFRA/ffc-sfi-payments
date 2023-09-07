const { CLOSURE_MARKETING_YEAR } = require('../mocks/values/closure-marketing-year')

const createClosurePaymentRequest = (paymentRequest) => {
  const closurePaymentRequest = { ...paymentRequest }
  closurePaymentRequest.paymentRequestNumber = paymentRequest.paymentRequestNumber + 1
  closurePaymentRequest.invoiceLines[0].value = -paymentRequest.value
  closurePaymentRequest.value = -paymentRequest.value
  closurePaymentRequest.marketingYear = CLOSURE_MARKETING_YEAR
  closurePaymentRequest.invoiceLines[0].marketingYear = CLOSURE_MARKETING_YEAR
  return closurePaymentRequest
}

module.exports = {
  createClosurePaymentRequest
}
