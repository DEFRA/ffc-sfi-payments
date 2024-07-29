const { AP } = require('../../constants/ledgers')
const { removeSettledSFI23AdvancePayments } = require('./remove-settled-sfi23-advance-payments')

const getTotalValue = (paymentRequests) => {
  const previousPaymentRequestsWithoutSFI23Advance = removeSettledSFI23AdvancePayments(paymentRequests)
  return previousPaymentRequestsWithoutSFI23Advance.filter(x => x.ledger === AP).reduce((x, y) => x + (y.value ?? 0), 0)
}

module.exports = {
  getTotalValue
}
