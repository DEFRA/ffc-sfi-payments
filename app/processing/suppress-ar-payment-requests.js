const { AP, AR } = require('../constants/ledgers')
const { sendSuppressedEvent } = require('../event')

const suppressARPaymentRequests = async (paymentRequest, completedPaymentRequests) => {
  const apPaymentRequests = completedPaymentRequests.filter(x => x.ledger === AP)
  const arPaymentRequests = completedPaymentRequests.filter(x => x.ledger === AR)

  if (arPaymentRequests.length === 0) {
    return completedPaymentRequests
  }

  const creditAP = apPaymentRequests.reduce((x, y) => x + y.value, 0)
  const suppressedAR = arPaymentRequests.reduce((x, y) => x + y.value, 0)
  const deltaValue = creditAP + suppressedAR

  await sendSuppressedEvent(paymentRequest, deltaValue, creditAP, suppressedAR)

  return apPaymentRequests.concat(arPaymentRequests.map(x => ({ ...x, value: 0, invoiceLines: [] })))
}

module.exports = {
  suppressARPaymentRequests
}
