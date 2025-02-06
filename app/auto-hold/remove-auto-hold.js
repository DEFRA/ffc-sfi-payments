const db = require('../data')
const { getHoldCategoryId } = require('./get-hold-category-id')
const { sendHoldEvent } = require('../event')
const { REMOVED } = require('../constants/hold-statuses')

const removeAutoHold = async (paymentRequest, holdCategoryName) => {
  const { schemeId, frn, marketingYear, agreementNumber } = paymentRequest
  const autoHoldCategoryId = await getHoldCategoryId(schemeId, holdCategoryName)
  const hold = await db.autoHold.findOne({ where: { frn, marketingYear, agreementNumber, autoHoldCategoryId, closed: null }, raw: true })
  if (hold) {
    const holdClosed = new Date()
    await db.autoHold.update({ closed: holdClosed }, { where: { frn, autoHoldCategoryId, closed: null } })
    await sendHoldEvent({ ...hold, closed: holdClosed }, REMOVED)
  }
}

module.exports = {
  removeAutoHold
}
