const { AP } = require('../constants/ledgers')

const filterAPPaymentRequests = (paymentRequests) => {
  return paymentRequests.completedPaymentRequests.filter(paymentRequest => paymentRequest.ledger === AP)
}

module.exports = {
  filterAPPaymentRequests
}
