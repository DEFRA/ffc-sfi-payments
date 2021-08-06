
const getOriginalSettlementDate = (paymentRequests) => {
  // first settlement date of agreement on AP ledger
  const firstSettlement = paymentRequests
    .filter(x => x.ledger === 'AP' && x.settled != null)
    .reduce((x, y) => {
      return x.settled > y.settled ? x.settled : y.settled
    }, 0)

  return firstSettlement !== 0 ? firstSettlement : undefined
}

module.exports = getOriginalSettlementDate
