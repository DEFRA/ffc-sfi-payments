const { createSplitInvoiceNumber } = require('../../invoice-number')
const calculateOverallDelta = require('./calculate-overall-delta')
const ensureValueConsistency = require('./ensure-value-consistency')

const splitToLedger = (paymentRequest, unsettledValue, unsettledLedger) => {
  const originalValue = paymentRequest.value

  paymentRequest.originalInvoiceNumber = paymentRequest.invoiceNumber
  paymentRequest.invoiceNumber = createSplitInvoiceNumber(paymentRequest, 'A')

  const splitPaymentRequest = copyPaymentRequest(paymentRequest, unsettledLedger)

  const splitApportionmentPercent = Math.abs(unsettledValue) / paymentRequest.value
  const apportionmentPercent = 1 - splitApportionmentPercent

  calculateInvoiceLines(paymentRequest.invoiceLines, apportionmentPercent)
  calculateInvoiceLines(splitPaymentRequest.invoiceLines, splitApportionmentPercent)

  paymentRequest.value = calculateOverallDelta(paymentRequest.invoiceLines)
  splitPaymentRequest.value = calculateOverallDelta(splitPaymentRequest.invoiceLines)

  ensureValueConsistency(originalValue, paymentRequest, splitPaymentRequest)

  return [paymentRequest, splitPaymentRequest]
}

const copyPaymentRequest = (paymentRequest, ledger) => {
  return {
    ...paymentRequest,
    ledger,
    invoiceNumber: createSplitInvoiceNumber(paymentRequest, 'B')
  }
}

const calculateInvoiceLines = (invoiceLines, apportionmentPercent) => {
  invoiceLines.map(x => { x.value = x.value > 0 ? Math.ceil(x.value * apportionmentPercent) : Math.floor(x.value * -apportionmentPercent) })
}

module.exports = splitToLedger
