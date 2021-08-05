const calculateLineDeltas = require('./calculate-line-deltas')
const calculateOverallDelta = require('./calculate-overall-delta')
const determineLedger = require('./determine-ledger')
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

  const unsettled = getUnsettled(previousPaymentRequests)

  if (unsettled) {
    if (unsettled.AR.value !== 0 && updatedPaymentRequest.ledger === 'AP') {
      if ((unsettled.AR.value * -1) > paymentRequest.value) {
        updatedPaymentRequest.ledger = 'AR'
      } else {
        const arPaymentRequest = { ...updatedPaymentRequest }
        const arApportionment = Math.floor((unsettled.AR.value * -1) / paymentRequest.value * 100)
        const apApportionment = Math.ceil(100 - arApportionment)
        const paymentReques
      }
    }
    if (unsettled.AP.value !== 0 && updatedPaymentRequest.ledger === 'AR') {
      if (unsettled.AP.value > (paymentRequest.value * -1)) {
        updatedPaymentRequest.ledger = 'AP'
      } else {

      }
    }
  }

  return [updatedPaymentRequest]
}

module.exports = calculateDelta
