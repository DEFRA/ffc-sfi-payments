const db = require('../data')
const { getHoldCategoryId } = require('.')
const { sendHoldEvent } = require('../event')
const { REMOVED } = require('../constants/hold-statuses')

const removeHoldByFrn = async (schemeId, frn, holdCategoryName) => {
  const holdCategoryId = await getHoldCategoryId(schemeId, holdCategoryName)
  const hold = await db.hold.findOne({ where: { frn, holdCategoryId, closed: null }, raw: true })
  if (hold) {
    const holdClosed = new Date()
    await db.hold.update({ closed: holdClosed }, { where: { frn, holdCategoryId, closed: null } })
    await sendHoldEvent({ ...hold, closed: holdClosed }, REMOVED)
  }
}

module.exports = {
  removeHoldByFrn
}
