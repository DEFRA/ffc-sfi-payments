const allocateToLedgers = require('./allocate-to-ledgers')
const calculateLineDeltas = require('./calculate-line-deltas')
const calculateOverallDelta = require('./calculate-overall-delta')
const getDefaultLedger = require('./get-default-ledger')
const getInvoiceLines = require('./get-invoice-lines')
const getOutstandingLedgerValues = require('./get-outstanding-ledger-values')
const zeroValueSplit = require('./zero-value-split')

const calculateDelta = (paymentRequest, previousPaymentRequests) => {
  const invoiceLines = getInvoiceLines(paymentRequest, previousPaymentRequests)

  const lineDeltas = calculateLineDeltas(invoiceLines)
  const overallDelta = calculateOverallDelta(invoiceLines)
  const updatedPaymentRequest = copyPaymentRequest(paymentRequest, overallDelta, lineDeltas)

  // if overall delta 0 but lines have non-zero lines,
  // need to move all positive lines to AP and all negative to AR.
  if (overallDelta === 0 && updatedPaymentRequest.invoiceLines.length) {
    return zeroValueSplit(updatedPaymentRequest)
  }

  // if either ledger has outstanding values to offset
  // need to reallocate/split to cover.
  const outstandingLedgerValues = getOutstandingLedgerValues(previousPaymentRequests)
  if (outstandingLedgerValues.hasOutstanding) {
    return allocateToLedgers(updatedPaymentRequest, outstandingLedgerValues)
  }

  return [updatedPaymentRequest]
}

const copyPaymentRequest = (paymentRequest, overallDelta, lineDeltas) => {
  return {
    ...paymentRequest,
    value: overallDelta,
    ledger: getDefaultLedger(overallDelta),
    invoiceLines: lineDeltas.filter(x => x.value !== 0)
  }
}

module.exports = calculateDelta
