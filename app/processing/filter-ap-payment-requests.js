const { AP } = require('../constants/ledgers')
const { sendSuppressedEvent } = require('../event')

const filterAPPaymentRequests = async (transformedPaymentRequests, paymentRequest) => {
  const filteredPaymentRequests = transformedPaymentRequests.completedPaymentRequests.filter(request => request.ledger === AP)
  if (filteredPaymentRequests.length < transformedPaymentRequests.completedPaymentRequests.length) {
    await sendSuppressedEvent(paymentRequest, transformedPaymentRequests)
  }
  return filteredPaymentRequests
}

module.exports = {
  filterAPPaymentRequests
}
