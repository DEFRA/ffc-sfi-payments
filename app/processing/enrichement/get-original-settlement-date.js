
const getOriginalSettlementDate = (paymentRequests) => {
  // first settlement date of agreement on AP ledger
  return paymentRequests
    .filter(x => x.ledger === 'AP' && x.settled != null)
    .reduce((x, y) => {
      return x > y.settled ? x : y.settled
    })
}

module.exports = getOriginalSettlementDate
