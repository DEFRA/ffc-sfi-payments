const { TOP_UP, RECOVERY } = require('../../app/constants/adjustment-types')
const { processingConfig } = require('../../app/config')

const createAdjustmentPaymentRequest = (paymentRequest, adjustmentType) => {
  const adjustmentPaymentRequest = { ...paymentRequest }
  adjustmentPaymentRequest.paymentRequestNumber = paymentRequest.paymentRequestNumber + 1
  adjustmentPaymentRequest.invoiceLines[0].value = getValue(adjustmentPaymentRequest.invoiceLines[0].value, adjustmentType)
  adjustmentPaymentRequest.value = getValue(adjustmentPaymentRequest.value, adjustmentType)
  return adjustmentPaymentRequest
}

const getValue = (currentValue, adjustmentType) => {
  if (adjustmentType === TOP_UP) {
    return currentValue + 50
  }
  if (adjustmentType === RECOVERY) {
    if (processingConfig.handleSFIClosures = true) {
      return -currentValue
    } else {
      return currentValue - 50
    }
  }
  return currentValue
}

module.exports = {
  createAdjustmentPaymentRequest
}
