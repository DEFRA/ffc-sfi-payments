const { AP } = require('../../constants/ledgers')
const { SFI23 } = require('../../constants/schemes')

const getTotalValue = (paymentRequests) => {
  return paymentRequests.filter(x => x.ledger === AP && !(x.schemeId === SFI23 && x.paymentRequestNumber === 0 && x.settledValue && /^.*2023$/.test(x.dueDate))).reduce((x, y) => x + (y.value ?? 0), 0)
}

module.exports = {
  getTotalValue
}
