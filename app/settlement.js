const db = require('./data')

const updateSettlementStatus = async (returnData) => {
  if (returnData.settled) {
    await db.completedPaymentRequest.update({
      lastSettlement: returnData.settlementDate,
      settledValue: db.Sequelize.literal(`COALESCE("settledValue", 0) + ${returnData.value}`)
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
              [db.Sequelize.Op.ne]: returnData.settlementDate
            }
          }]
      }
    })
  }
}

module.exports = updateSettlementStatus
