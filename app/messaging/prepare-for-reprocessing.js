const db = require('../data')
const { sendProcessingRouteEvent } = require('../event')
const { removeHold } = require('./remove-hold')

const prepareForReprocessing = async (paymentRequest, debtType, recoveryDate) => {
  await db.paymentRequest.update({
    debtType,
    recoveryDate
  }, {
    where: { paymentRequestId: paymentRequest.paymentRequestId }
  })
  await removeHold(paymentRequest.schemeId, paymentRequest.frn, 'Awaiting debt enrichment')
  await sendProcessingRouteEvent(paymentRequest, 'debt', 'response')
}

module.exports = {
  prepareForReprocessing
}
