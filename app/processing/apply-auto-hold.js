const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const holdAndReschedule = require('../reschedule')
const { autoHold } = require('../config')

const applyAutoHold = async (paymentRequests) => {
  if (paymentRequests[0].paymentRequestNumber === 1) {
    return false
  }

  const totalValue = paymentRequests.reduce((x, y) => x + y.value, 0)

  if (autoHold.topUp && totalValue >= 0) {
    await applyHold(paymentRequests[0].schemeId, paymentRequests[0].paymentRequestId, paymentRequests[0].frn, 'Top up')
    return true
  }

  if (autoHold.recovery && totalValue > 0) {
    await applyHold(paymentRequests[0].schemeId, paymentRequests[0].paymentRequestId, paymentRequests[0].frn, 'Recovery')
    return true
  }

  return false
}

const applyHold = async (schemeId, paymentRequestId, frn, category) => {
  const transaction = await db.sequelize.transaction()
  try {
    console.log(`${category} automatically held: ${frn}`)
    const holdCategoryId = await getHoldCategoryId(schemeId, category, transaction)
    await holdAndReschedule(schemeId, paymentRequestId, holdCategoryId, frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = applyAutoHold
