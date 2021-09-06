const db = require('./data')

const updateSettlementStatus = async (returnData) => {
  if (returnData.settled) {
    await db.completedPaymentRequest.update({ settled: returnData.settlementDate }, { where: { invoiceNumber: returnData.invoiceNumber } })
  }
}

module.exports = updateSettlementStatus
