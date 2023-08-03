const { updateSettlementStatus } = require('./update-settlement-status')
const { getSettlementFilter } = require('./get-settlement-filter')
const { sendProcessingReturnEvent } = require('../event')

const processSettlement = async (settlement) => {
  if (settlement.settled) {
    const filter = getSettlementFilter(settlement)
    const settledPaymentRequest = await updateSettlementStatus(settlement, filter)
    if (settledPaymentRequest) {
      await sendProcessingReturnEvent({ ...settlement, ...settledPaymentRequest })
      return true
    }
  }

  await sendProcessingReturnEvent(settlement, true)
  return false
}

module.exports = {
  processSettlement
}
