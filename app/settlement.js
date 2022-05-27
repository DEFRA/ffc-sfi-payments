const db = require('./data')
const { sendProcessingReturnEvent } = require('./event')

const updateSettlementStatus = async (returnData) => {
  if (returnData.settled) {
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
    if (updated) {
      await sendProcessingReturnEvent(returnData)
    }
  }
}

module.exports = updateSettlementStatus
