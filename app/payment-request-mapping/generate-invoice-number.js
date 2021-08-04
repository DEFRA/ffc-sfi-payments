const generateInvoiceNumber = (paymentRequest) => {
  let generatedInvoiceNumber = null

  if (paymentRequest.invoiceNumber) {
    generatedInvoiceNumber = paymentRequest.invoiceNumber.slice(-8)
  } else {
    generatedInvoiceNumber = paymentRequest.agreementNumber.slice(-8)
  }

  return `S${generatedInvoiceNumber}${paymentRequest.contractNumber}V0${paymentRequest.paymentRequestNumber}`
}

module.exports = generateInvoiceNumber
