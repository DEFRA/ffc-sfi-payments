const { updateSettlementStatus } = require('./update-settlement-status')
const { sendProcessingReturnEvent } = require('../event')

const processSettlement = async (returnData) => {
  if (returnData.settled) {
    const updated = await updateSettlementStatus(returnData)
    if (updated) {
      await sendProcessingReturnEvent(returnData)
      return true
    }
  }

  await sendProcessingReturnEvent(returnData, true)
  return false
}

module.exports = {
  processSettlement
}
