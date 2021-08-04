const generateInvoiceNumber = (paymentRequest) => {
  return `S${paymentRequest.invoiceNumber
    ? paymentRequest.invoiceNumber.slice(-8)
    : paymentRequest.agreementNumber.slice(-8)}${paymentRequest.contractNumber}V${paymentRequest.paymentRequestNumber.toString().padStart(2, '0')}`
}

module.exports = generateInvoiceNumber
