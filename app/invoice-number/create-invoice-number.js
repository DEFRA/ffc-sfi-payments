const createInvoiceNumber = (paymentRequest) => {
  return `S${paymentRequest.invoiceNumber
    ? paymentRequest.invoiceNumber.slice(-8)
    : paymentRequest.agreementNumber.slice(-8)}${paymentRequest.contractNumber}V${paymentRequest.paymentRequestNumber.toString().padStart(3, '0')}`
}

module.exports = createInvoiceNumber
