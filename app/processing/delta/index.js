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

  // do zero value split - all positive to AP all negative to AR
  // zero value = overall net 0 but lines with values
  if(overallDelta === 0) {
    
  }
  else if (unsettled) {
    if (unsettled.AR.value !== 0 && updatedPaymentRequest.ledger === 'AP') {
      if ((unsettled.AR.value * -1) > paymentRequest.value) {
        updatedPaymentRequest.ledger = 'AR'
      } else {
        const arPaymentRequest = { ...updatedPaymentRequest }
        const arApportionment = (unsettled.AR.value * -1) / paymentRequest.value
        const apApportionment = 1 - arApportionment
        updatedPaymentRequest.invoiceLines = updatedPaymentRequest.invoiceLines.map(x => {
          return {
            ...x,
            value: Math.ceil(x.value * apApportionment)
          }
        })
        updatedPaymentRequest.value = calculateOverallDelta(updatedPaymentRequest.invoiceLines)
        arPaymentRequest.invoiceLines = arPaymentRequest.invoiceLines.map(x => {
          return {
            ...x,
            value: Math.floor(x.value * arApportionment)
          }
        })
        arPaymentRequest.value = calculateOverallDelta(arPaymentRequest.invoiceLines)
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
