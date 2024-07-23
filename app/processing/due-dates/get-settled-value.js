const { AP } = require('../../constants/ledgers')
const { SFI23 } = require('../../constants/schemes')

const getSettledValue = (previousPaymentRequests) => {
  return previousPaymentRequests.filter(x => x.ledger === AP && !(x.schemeId === SFI23 && x.paymentRequestNumber === 0 && x.settledValue && /^.*2023$/.test(x.dueDate))).reduce((x, y) => x + (y.settledValue ?? 0), 0)
}

module.exports = {
  getSettledValue
}
