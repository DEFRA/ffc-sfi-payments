const { TOP_UP, RECOVERY } = require('../../app/constants/adjustment-types')

const createAdjustmentPaymentRequest = async (paymentRequest, adjustmentType) => {
  const adjustmentPaymentRequest = JSON.parse(JSON.stringify(paymentRequest))
  adjustmentPaymentRequest.paymentRequestNumber = paymentRequest.paymentRequestNumber + 1
  adjustmentPaymentRequest.invoiceLines[0].value = getValue(adjustmentPaymentRequest.invoiceLines[0].value, adjustmentType)
  adjustmentPaymentRequest.value = getValue(adjustmentPaymentRequest.value, adjustmentType)
  return adjustmentPaymentRequest
}

const getValue = (currentValue, adjustmentType) => {
  if (adjustmentType === TOP_UP) {
    return currentValue + 10
  }
  if (adjustmentType === RECOVERY) {
    return currentValue - 10
  }
  return currentValue
}

module.exports = {
  createAdjustmentPaymentRequest
}
