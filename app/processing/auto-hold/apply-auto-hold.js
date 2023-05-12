const { autoHold } = require('../../config').processingConfig
const { applyHold } = require('./apply-hold')

const applyAutoHold = async (paymentRequests) => {
  if (paymentRequests[0].paymentRequestNumber === 1) {
    return false
  }

  const totalValue = paymentRequests.reduce((x, y) => x + y.value, 0)

  if (autoHold.topUp && totalValue >= 0) {
    await applyHold(paymentRequests[0].schemeId, paymentRequests[0].paymentRequestId, paymentRequests[0].frn, 'Top up')
    return true
  }

  if (autoHold.recovery && totalValue < 0) {
    await applyHold(paymentRequests[0].schemeId, paymentRequests[0].paymentRequestId, paymentRequests[0].frn, 'Recovery')
    return true
  }

  return false
}

module.exports = {
  applyAutoHold
}
