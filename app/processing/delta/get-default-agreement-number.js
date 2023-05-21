const getDefaultAgreementNumber = (paymentRequest, previousPaymentRequests) => {
  const firstAgreementNumber = previousPaymentRequests.filter(x => x.agreementNumber)?.sort((a, b) => a.paymentRequestNumber - b.paymentRequestNumber)[0]?.agreementNumber
  return firstAgreementNumber ?? paymentRequest.agreementNumber ?? paymentRequest.invoiceLines.filter(x => x.agreementNumber)[0]?.agreementNumber
}

module.exports = {
  getDefaultAgreementNumber
}
