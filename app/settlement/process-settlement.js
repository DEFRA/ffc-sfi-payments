const { updateSettlementStatus } = require('./update-settlement-status')
const { getSettlementFilter } = require('./get-settlement-filter')
const { sendProcessingReturnEvent } = require('../event')

const processSettlement = async (settlement) => {
  if (settlement.settled) {
    const filter = getSettlementFilter(settlement)
    const updatedInvoiceNumber = await updateSettlementStatus(settlement, filter)
    if (updatedInvoiceNumber) {
      await sendProcessingReturnEvent({ ...settlement, invoiceNumber: updatedInvoiceNumber })
      return true
    }
  }

  await sendProcessingReturnEvent(settlement, true)
  return false
}

module.exports = {
  processSettlement
}
