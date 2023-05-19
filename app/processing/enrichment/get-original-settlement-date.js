const { AP } = require('../../constants/ledgers')
const { convertDateToDDMMYYYY } = require('../../convert-date')

const getOriginalSettlementDate = (paymentRequests) => {
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
