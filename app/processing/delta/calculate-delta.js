const { allocateToLedgers } = require('./assign-ledger')
const { getInvoiceLines } = require('./get-invoice-lines')
const { getDefaultAgreementNumber } = require('./get-default-agreement-number')
const { calculateLineDeltas } = require('./calculate-line-deltas')
const { calculateOverallDelta } = require('./calculate-overall-delta')
const {
  createCompletedPaymentRequest
} = require('./create-completed-payment-request')
const {
  getOutstandingLedgerValues
} = require('./get-outstanding-ledger-values')
const { zeroValueSplit } = require('./zero-value-split')
const { isFirstClaim } = require('./is-first-claim')

const calculateDelta = (paymentRequest, previousPaymentRequests) => {
  const invoiceLines = getInvoiceLines(paymentRequest, previousPaymentRequests)

  const defaultAgreementNumber = getDefaultAgreementNumber(
    paymentRequest,
    previousPaymentRequests
  )
  const lineDeltas = calculateLineDeltas(invoiceLines, defaultAgreementNumber)
  const overallDelta = calculateOverallDelta(invoiceLines)
  const updatedPaymentRequest = createCompletedPaymentRequest(
    paymentRequest,
    overallDelta,
    lineDeltas
  )
  const deltaPaymentRequest = JSON.parse(JSON.stringify(updatedPaymentRequest))

  // Check if this is first claim and has zero total
  const firstClaim = isFirstClaim(paymentRequest, previousPaymentRequests)

  // if overall delta 0 but lines have non-zero lines,
  // need to move all positive lines to AP and all negative to AP.
  if (overallDelta === 0 && updatedPaymentRequest.invoiceLines.length) {
    const completedPaymentRequests = zeroValueSplit(
      updatedPaymentRequest,
      firstClaim
    )
    return { deltaPaymentRequest, completedPaymentRequests }
  }

  // if either ledger has outstanding values to offset
  // need to reallocate/split to cover.
  const outstandingLedgerValues = getOutstandingLedgerValues(
    previousPaymentRequests
  )
  if (outstandingLedgerValues.hasOutstanding) {
    const completedPaymentRequests = allocateToLedgers(
      updatedPaymentRequest,
      outstandingLedgerValues
    )
    return { deltaPaymentRequest, completedPaymentRequests }
  }

  return {
    deltaPaymentRequest,
    completedPaymentRequests: [updatedPaymentRequest]
  }
}

module.exports = {
  calculateDelta
}
