const isFirstClaim = (paymentRequest, previousPaymentRequests) => {
  return !previousPaymentRequests.some(
    firstPayment =>
      firstPayment.schemeId === paymentRequest.schemeId &&
      firstPayment.agreementNumber === paymentRequest.agreementNumber
  )
}

module.exports = { isFirstClaim }
