const db = require('../data')
const { getHoldCategoryId } = require('../holds')

const updateRequestsAwaitingDebtData = async (paymentRequest) => {
  if (!paymentRequest.debtType) {
    throw new Error(`Payment request does not include debt data: ${paymentRequest.invoiceNumber}`)
  }

  const originalPaymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })

  if (!originalPaymentRequest) {
    throw new Error(`No payment request matching invoice number: ${paymentRequest.invoiceNumber}`)
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
}

async function removeHold (schemeId, frn) {
  const holdCategoryId = await getHoldCategoryId(schemeId, 'Awaiting debt enrichment')
  await db.hold.update({ closed: new Date() }, { where: { frn, holdCategoryId } })
}

module.exports = updateRequestsAwaitingDebtData
