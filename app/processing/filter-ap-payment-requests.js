const { AP, AR } = require('../constants/ledgers')
const { sendSuppressedEvent } = require('../event')

const filterAPPaymentRequests = async (paymentRequest, completedPaymentRequests) => {
  const totalValue = completedPaymentRequests.reduce((x, y) => x + y.value, 0) === 0
  const apPaymentRequests = completedPaymentRequests.filter(x => x.ledger === AP)
  const arPaymentRequests = completedPaymentRequests.filter(x => x.ledger === AR)

  if (totalValue === 0 || arPaymentRequests.length === 0) {
    return completedPaymentRequests
  }

  const creditAP = apPaymentRequests.reduce((x, y) => x + y.value, 0)
  const suppressedAR = arPaymentRequests.reduce((x, y) => x + y.value, 0)
  const deltaValue = creditAP + suppressedAR

  await sendSuppressedEvent(paymentRequest, deltaValue, creditAP, suppressedAR)

  return apPaymentRequests
}

module.exports = {
  filterAPPaymentRequests
}
