const { v4: uuidv4 } = require('uuid')
const { createSplitInvoiceNumber } = require('../invoice-number')

const createLedgerSplitPaymentRequest = (paymentRequest, ledger) => {
  const copiedPaymentRequest = JSON.parse(JSON.stringify(paymentRequest))
  return {
    ...copiedPaymentRequest,
    ledger,
    invoiceNumber: createSplitInvoiceNumber(paymentRequest.originalInvoiceNumber, 'B', paymentRequest.schemeId),
    referenceId: uuidv4()
  }
}

module.exports = {
  createLedgerSplitPaymentRequest
}
