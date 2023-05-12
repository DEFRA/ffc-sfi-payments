const { AP } = require('../../constants/ledgers')

const getSettledValue = (previousPaymentRequests) => {
  return previousPaymentRequests.filter(x => x.ledger === AP).reduce((x, y) => x + (y.settledValue ?? 0), 0)
}

module.exports = {
  getSettledValue
}
