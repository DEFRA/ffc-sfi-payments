const generateInvoiceNumber = (paymentRequest) => {
  const invoiceNumber = paymentRequest.invoiceNumber
    ? paymentRequest.invoiceNumber.slice(-8)
    : paymentRequest.agreementNumber.slice(-8)

  const paymentRequestNumber = paymentRequest.paymentRequestNumber.toString().length === 1
    ? `V${paymentRequest.paymentRequestNumber.toString().padStart(2, '0')}`
    : `V${paymentRequest.paymentRequestNumber}`

  return `S${invoiceNumber}${paymentRequest.contractNumber}${paymentRequestNumber}`
}

module.exports = generateInvoiceNumber
