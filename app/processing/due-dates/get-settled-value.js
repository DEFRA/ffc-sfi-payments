const { AP } = require('../../constants/ledgers')
const { removeSettledSFI23AdvancePayments } = require('./remove-settled-sfi23-advance-payments')

const getSettledValue = (previousPaymentRequests) => {
  const previousPaymentRequestsWithoutSFI23Advance = removeSettledSFI23AdvancePayments(previousPaymentRequests)
  return previousPaymentRequestsWithoutSFI23Advance.filter(x => x.ledger === AP).reduce((x, y) => x + (y.settledValue ?? 0), 0)
}

module.exports = {
  getSettledValue
}
