const db = require('../data')
const { VALIDATION } = require('../errors')
const { getHoldCategoryId } = require('../holds')
const { sendProcessingRouteEvent } = require('../event')

const updateRequestsAwaitingDebtData = async (paymentRequest) => {
  if (!paymentRequest.debtType) {
    const error = new Error(`Payment request does not include debt data: ${paymentRequest.invoiceNumber}`)
    error.category = VALIDATION
    throw error
  }

  const originalPaymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })

  if (!originalPaymentRequest) {
    const error = new Error(`No payment request matching invoice number: ${paymentRequest.invoiceNumber}`)
    error.category = VALIDATION
    throw error
  }
  await prepareForReprocessing(originalPaymentRequest, paymentRequest.debtType, paymentRequest.recoveryDate)
}

const prepareForReprocessing = async (paymentRequest, debtType, recoveryDate) => {
  await db.paymentRequest.update({
    debtType,
    recoveryDate
  }, {
    where: { paymentRequestId: paymentRequest.paymentRequestId }
  })
  await removeHold(paymentRequest.schemeId, paymentRequest.frn)
  await sendProcessingRouteEvent(paymentRequest, 'debt', 'response')
}

async function removeHold (schemeId, frn) {
  const holdCategoryId = await getHoldCategoryId(schemeId, 'Awaiting debt enrichment')
  await db.hold.update({ closed: new Date() }, { where: { frn, holdCategoryId } })
}

module.exports = updateRequestsAwaitingDebtData
