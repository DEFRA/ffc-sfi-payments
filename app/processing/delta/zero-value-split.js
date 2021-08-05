const { createSplitInvoiceNumber } = require('../../invoice-number')
const calculateOverallDelta = require('./calculate-overall-delta')

const zeroValueSplit = (paymentRequest) => {
  const apPaymentRequest = { ...paymentRequest, ledger: 'AP', invoiceLines: [] }
  const arPaymentRequest = { ...paymentRequest, ledger: 'AR', invoiceLines: [] }

  paymentRequest.invoiceLines.map(invoiceLine => {
    if (invoiceLine.value > 0) {
      apPaymentRequest.invoiceLines.push(invoiceLine)
    } else {
      arPaymentRequest.invoiceLines.push(invoiceLine)
    }
  })

  arPaymentRequest.value = calculateOverallDelta(arPaymentRequest.invoiceLines)
  apPaymentRequest.value = calculateOverallDelta(apPaymentRequest.invoiceLines)

  apPaymentRequest.invoiceNumber = createSplitInvoiceNumber(apPaymentRequest, 'A')
  arPaymentRequest.invoiceNumber = createSplitInvoiceNumber(arPaymentRequest, 'B')

  return [apPaymentRequest, apPaymentRequest]
}

module.exports = zeroValueSplit
