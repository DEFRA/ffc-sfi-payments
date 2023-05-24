const { updateSettlementStatus } = require('./update-settlement-status')
const { sendProcessingReturnEvent } = require('../event')

const processSettlement = async (settlement) => {
  if (settlement.settled) {
    const updated = await updateSettlementStatus(settlement)
    if (updated) {
      await sendProcessingReturnEvent(settlement)
      return true
    }
  }

  await sendProcessingReturnEvent(settlement, true)
  return false
}

module.exports = {
  processSettlement
}
