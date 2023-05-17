const db = require('../data')

const updateSettlementStatus = async (settlement) => {
  const updated = await db.completedPaymentRequest.update({
    lastSettlement: settlement.settlementDate,
    settledValue: settlement.value
  }, {
    where: {
      invoiceNumber: settlement.invoiceNumber,
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
  return updated[0] > 0
}

module.exports = {
  updateSettlementStatus
}
