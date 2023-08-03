const db = require('../data')

const updateSettlementStatus = async (settlement, filter) => {
  const completedPaymentRequest = await db.completedPaymentRequest.findOne({
    where: {
      ...filter
    }
  })

  if (!completedPaymentRequest) {
    return false
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
  return true
}

module.exports = {
  updateSettlementStatus
}
