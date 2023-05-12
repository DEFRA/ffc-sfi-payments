const { getHolds } = require('./get-holds')

const removeHolds = async (scheduledPaymentRequests, transaction) => {
  const holds = await getHolds(transaction)
  return scheduledPaymentRequests.filter(x =>
    !holds.some(y => y.holdCategory.schemeId === x.paymentRequest.schemeId && y.frn === x.paymentRequest.frn))
}

module.exports = {
  removeHolds
}
