const { BPS, CS } = require('../constants/schemes')

const getCompletedPaymentRequestsFilter = (paymentRequest) => {
  switch (paymentRequest.schemeId) {
    case BPS:
      return {
        schemeId: paymentRequest.schemeId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear
      }
    case CS:
      return {
        schemeId: paymentRequest.schemeId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        contractNumber: paymentRequest.contractNumber // TODO handle A0/A prefixes
      }
    default:
      return {
        schemeId: paymentRequest.schemeId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        agreementNumber: paymentRequest.agreementNumber
      }
  }
}

module.exports = {
  getCompletedPaymentRequestsFilter
}
