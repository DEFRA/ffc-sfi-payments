const { AP } = require('../../ledgers')
const { convertDateToDDMMYYYY } = require('../../convert-date')

const getOriginalSettlementDate = (paymentRequests) => {
  // first settlement date of agreement on AP ledger
  const settlementDates = paymentRequests
    // sequelize returns empty values as null so need null check
    .filter(x => x.ledger === AP && x.lastSettlement != null)
    .map(x => x.lastSettlement)

  if (!settlementDates.length) {
    return undefined
  }

  const originalSettlementDate = new Date(Math.min(...settlementDates))
  return convertDateToDDMMYYYY(originalSettlementDate.getDate(), originalSettlementDate.getMonth(), originalSettlementDate.getFullYear())
}

module.exports = getOriginalSettlementDate
