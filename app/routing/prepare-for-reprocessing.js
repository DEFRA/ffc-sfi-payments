const db = require('../data')
const { AWAITING_DEBT_ENRICHMENT } = require('../constants/hold-categories-names')
const { sendProcessingRouteEvent } = require('../event')
const { removeHold } = require('./remove-hold')

const prepareForReprocessing = async (paymentRequest, debtType, recoveryDate) => {
  await db.paymentRequest.update({
    debtType,
    recoveryDate
  }, {
    where: { paymentRequestId: paymentRequest.paymentRequestId }
  })
  await removeHold(paymentRequest.schemeId, paymentRequest.frn, AWAITING_DEBT_ENRICHMENT)
  await sendProcessingRouteEvent(paymentRequest, 'debt', 'response')
}

module.exports = {
  prepareForReprocessing
}
