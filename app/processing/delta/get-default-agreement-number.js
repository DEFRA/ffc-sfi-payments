const getDefaultAgreementNumber = (paymentRequest, previousPaymentRequests) => {
  const firstAgreementNumber = previousPaymentRequests.filter(x => x.agreementNumber)?.sort((a, b) => a.paymentRequestNumber - b.paymentRequestNumber)[0]?.agreementNumber
  if (firstAgreementNumber) {
    return firstAgreementNumber
  }
  const previousAgreementNumbers = []
  for (const previousPaymentRequest of previousPaymentRequests) {
    for (const previousInvoiceLine of previousPaymentRequest.invoiceLines) {
      if (previousInvoiceLine.agreementNumber) {
        previousAgreementNumbers.push(previousInvoiceLine.agreementNumber)
      }
    }
  }
  return previousAgreementNumbers[0] ?? paymentRequest.agreementNumber
}

module.exports = {
  getDefaultAgreementNumber
}
