const calculateOverallDelta = require('./calculate-overall-delta')

const splitToLedger = (paymentRequest, unsettledValue, unsettledLedger) => {
  const splitPaymentRequest = { ...paymentRequest, ledger: unsettledLedger }
  const splitApportionmentPercent = Math.abs(unsettledValue) / paymentRequest.value
  const apportionmentPercent = 1 - splitApportionmentPercent
  paymentRequest.invoiceLines.map(x => { x.value = Math.ceil(x.value * apportionmentPercent) })
  splitPaymentRequest.invoiceLines.map(x => { x.value = Math.floor(x.value * splitApportionmentPercent) })
  paymentRequest.value = calculateOverallDelta(paymentRequest.invoiceLines)
  splitPaymentRequest.value = calculateOverallDelta(splitPaymentRequest.invoiceLines)

  return [paymentRequest, splitPaymentRequest]
}

module.exports = splitToLedger
