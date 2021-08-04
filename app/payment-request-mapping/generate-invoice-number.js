const generateInvoiceNumber = (paymentRequest) => {
  const invoiceNumber = paymentRequest.invoiceNumber
    ? paymentRequest.invoiceNumber.slice(-8)
    : paymentRequest.agreementNumber.slice(-8)

  const paymentRequestNumber = paymentRequest.paymentRequestNumber.toString().length === 1
    ? `V0${paymentRequest.paymentRequestNumber}`
    : `V${paymentRequest.paymentRequestNumber}`

  return `S${invoiceNumber}${paymentRequest.contractNumber}${paymentRequestNumber}`
}

module.exports = generateInvoiceNumber
