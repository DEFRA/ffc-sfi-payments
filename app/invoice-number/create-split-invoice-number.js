const createSplitInvoiceNumber = (paymentRequest, splitId) => {
  return `S${paymentRequest.invoiceNumber
    ? paymentRequest.invoiceNumber.slice(-8)
    : paymentRequest.agreementNumber.slice(-8)}${splitId}${paymentRequest.contractNumber}V${paymentRequest.paymentRequestNumber.toString().padStart(2, '0')}`
}

module.exports = createSplitInvoiceNumber
