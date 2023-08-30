const { AP } = require('../../constants/ledgers')
const { convertDateToDDMMYYYY } = require('../../convert-date')

const getOriginalSettlementDate = (paymentRequests) => {
  // retain original settlement date if it already exists
  const existingOriginalSettlementDates = paymentRequests
    .filter(x => x.originalSettlementDate !== null && typeof x.originalSettlementDate !== 'undefined')
    .map(x => x.originalSettlementDate)
  if (existingOriginalSettlementDates.length) {
    return existingOriginalSettlementDates[0]
  }
  // first settlement date of agreement on AP ledger
  const settlementDates = paymentRequests
    .filter(x => x.ledger === AP && x.lastSettlement != null)
    .map(x => x.lastSettlement)

  if (!settlementDates.length) {
    return undefined
  }

  const originalSettlementDate = new Date(Math.min(...settlementDates))
  const month = originalSettlementDate.getMonth() + 1
  return convertDateToDDMMYYYY(originalSettlementDate.getDate(), month, originalSettlementDate.getFullYear())
}

module.exports = {
  getOriginalSettlementDate
}
