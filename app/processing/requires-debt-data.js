const { AR } = require('../ledgers')

const requiresDebtData = (paymentRequests) => {
  return paymentRequests.some(x => x.ledger === AR && x.debtType == null)
}

module.exports = requiresDebtData
