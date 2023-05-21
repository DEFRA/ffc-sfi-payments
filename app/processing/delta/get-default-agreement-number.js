const getDefaultAgreementNumber = (previousPaymentRequests, currentAgreementNumber) => {
  const firstAgreementNumber = previousPaymentRequests.filter(x => x.agreementNumber)?.sort((a, b) => a.paymentRequestNumber - b.paymentRequestNumber)[0]?.agreementNumber
  return firstAgreementNumber ?? currentAgreementNumber
}

module.exports = {
  getDefaultAgreementNumber
}
