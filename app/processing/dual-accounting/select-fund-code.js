const selectFundCode = (previousPaymentRequests, firstPaymentFundCode, previousFundCode, defaultFundCode) => {
  if (!previousPaymentRequests.length) {
    return firstPaymentFundCode
  }
  return previousFundCode ?? defaultFundCode
}

module.exports = {
  selectFundCode
}
