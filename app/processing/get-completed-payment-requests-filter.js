const db = require('../data')
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
        [db.Sequelize.Op.or]: [
          { contractNumber: paymentRequest.contractNumber },
          { contractNumber: paymentRequest.contractNumber.replace('A0', 'A') }
        ]
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
