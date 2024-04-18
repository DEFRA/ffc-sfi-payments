const { BPS, FDMR } = require('../constants/schemes')
const db = require('../data')
const { adjustSettlementValue } = require('./adjust-settlement-value')

const updateSettlementStatus = async (settlement, filter) => {
  const completedPaymentRequest = await db.completedPaymentRequest.findOne({
    where: {
      ...filter
    }
  })

  if (!completedPaymentRequest) {
    return undefined
  }

  if ([BPS, FDMR].includes(completedPaymentRequest.schemeId)) {
    settlement.value = await adjustSettlementValue(settlement, completedPaymentRequest)
  }
  await db.completedPaymentRequest.update({
    lastSettlement: settlement.settlementDate,
    settledValue: settlement.value
  }, {
    where: {
      ...filter,
      [db.Sequelize.Op.or]:
        [{
          lastSettlement: {
            [db.Sequelize.Op.is]: null
          }
        }, {
          lastSettlement: {
            [db.Sequelize.Op.lt]: settlement.settlementDate
          }
        }]
    }
  })
  return { frn: parseInt(completedPaymentRequest.frn), invoiceNumber: completedPaymentRequest.invoiceNumber }
}

module.exports = {
  updateSettlementStatus
}
