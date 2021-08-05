const allocateToLedgers = require('./allocate-to-ledgers')
const calculateLineDeltas = require('./calculate-line-deltas')
const calculateOverallDelta = require('./calculate-overall-delta')
const determineLedger = require('./get-default-ledger')
const ensureValueConsistency = require('./ensure-value-consistency')
const getInvoiceLines = require('./get-invoice-lines')
const getUnsettled = require('./get-unsettled')

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

  // do zero value split - all positive to AP all negative to AR
  // zero value = overall net 0 but lines with values
  if (overallDelta === 0 && invoiceLines.length) {
    return [updatedPaymentRequest]
  }

  const unsettled = getUnsettled(previousPaymentRequests)
  if (unsettled) {
    return allocateToLedgers(updatedPaymentRequest, unsettled)
  }

  return [updatedPaymentRequest]
}

module.exports = calculateDelta
