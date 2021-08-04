const calculateLineDeltas = require('./calculate-line-deltas')
const calculateOverallDelta = require('./calculate-overall-delta')
const determineLedger = require('./determine-ledger')
const ensureValueConsistency = require('./ensure-value-consistency')
const getInvoiceLines = require('./get-invoice-lines')

const calculateDelta = async (paymentRequest, previousPaymentRequests) => {
  const invoiceLines = getInvoiceLines(paymentRequest, previousPaymentRequests)

  const overallDelta = calculateOverallDelta(invoiceLines)
  const lineDeltas = calculateLineDeltas(invoiceLines)

  ensureValueConsistency(overallDelta, lineDeltas)

  const updatedPaymentRequest = {
    ...paymentRequest,
    value: overallDelta,
    ledger: determineLedger(overallDelta),
    invoiceLines: lineDeltas.filter(x => x.value !== 0)
  }

  return [updatedPaymentRequest]
}

module.exports = calculateDelta
