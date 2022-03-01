const db = require('../data')
const { getHoldCategoryId } = require('../holds')

const updateRequestsAwaitingDebtData = async (paymentRequest) => {
  // await prepareForReprocessing(paymentRequest)
}

const prepareForReprocessing = async (paymentRequest) => {
  await removeHold(paymentRequest.schemeId, paymentRequest.frn)
}

async function removeHold (schemeId, frn) {
  const holdCategoryId = await getHoldCategoryId(schemeId, 'Manual ledger hold')
  await db.hold.update({ closed: new Date() }, { where: { frn, holdCategoryId } })
}

module.exports = updateRequestsAwaitingDebtData
