const { v4: uuidv4 } = require('uuid')
const { createSplitInvoiceNumber } = require('../invoice-number')

const createSplitPaymentRequest = (paymentRequest, ledger, splitId) => {
  return {
    ...paymentRequest,
    ledger,
    originalInvoiceNumber: paymentRequest.originalInvoiceNumber ?? paymentRequest.invoiceNumber,
    invoiceNumber: createSplitInvoiceNumber(paymentRequest.invoiceNumber, splitId, paymentRequest.schemeId),
    invoiceLines: [],
    referenceId: uuidv4()
  }
}

module.exports = {
  createSplitPaymentRequest
}
