
const getOriginalSettlementDate = (paymentRequests) => {
  // first settlement date of agreement on AP ledger
  const settlementDates = paymentRequests
    // sequelize returns empty values as null so need null check
    .filter(x => x.ledger === 'AP' && x.settled != null)
    .map(x => x.settled)

  if (!settlementDates.length) {
    return undefined
  }

  return new Date(Math.min(...settlementDates))
}

module.exports = getOriginalSettlementDate
