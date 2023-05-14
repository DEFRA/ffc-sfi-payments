const db = require('../data')

const updateSettlementStatus = async (returnData) => {
  const updated = await db.completedPaymentRequest.update({
    lastSettlement: returnData.settlementDate,
    settledValue: returnData.value
  }, {
    where: {
      invoiceNumber: returnData.invoiceNumber,
      [db.Sequelize.Op.or]:
        [{
          lastSettlement: {
            [db.Sequelize.Op.is]: null
          }
        }, {
          lastSettlement: {
            [db.Sequelize.Op.lt]: returnData.settlementDate
          }
        }]
    }
  })
  return updated[0] > 0
}

module.exports = {
  updateSettlementStatus
}
