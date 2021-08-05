const calculateOverallDelta = require('./calculate-overall-delta')
const ensureValueConsistency = require('./ensure-value-consistency')

const splitToLedger = (paymentRequest, unsettledValue, unsettledLedger) => {
  const originalValue = paymentRequest.value
  const splitPaymentRequest = { ...paymentRequest, ledger: unsettledLedger }
  const splitApportionmentPercent = Math.abs(unsettledValue) / paymentRequest.value
  const apportionmentPercent = 1 - splitApportionmentPercent

  paymentRequest.invoiceLines.map(x => { x.value = Math.ceil(x.value * apportionmentPercent) })
  paymentRequest.value = calculateOverallDelta(paymentRequest.invoiceLines)

  splitPaymentRequest.invoiceLines.map(x => { x.value = Math.floor(x.value * splitApportionmentPercent) })
  splitPaymentRequest.value = calculateOverallDelta(splitPaymentRequest.invoiceLines)

  ensureValueConsistency(originalValue, paymentRequest, splitPaymentRequest)

  return [paymentRequest, splitPaymentRequest]
}

module.exports = splitToLedger
