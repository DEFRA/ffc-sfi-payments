const db = require('../data')
const { AWAITING_DEBT_ENRICHMENT } = require('../constants/hold-categories-names')
const { removeAutoHold } = require('../auto-hold')

const prepareForReprocessing = async (paymentRequest, debtType, recoveryDate) => {
  await db.paymentRequest.update({
    debtType,
    recoveryDate
  }, {
    where: { paymentRequestId: paymentRequest.paymentRequestId }
  })
  await removeAutoHold(paymentRequest, AWAITING_DEBT_ENRICHMENT)
}

module.exports = {
  prepareForReprocessing
}
