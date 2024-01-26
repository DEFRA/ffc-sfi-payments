const db = require('../data')
const { REMOVED } = require('../constants/hold-statuses')
const { sendHoldEvent } = require('../event')

const removeBulkHold = async (data, holdCategoryId) => {
  for (const frn of data) {
    const hold = await db.hold.findOne({ where: { frn, holdCategoryId, closed: null }, raw: true })
    if (hold) {
      const holdClosed = new Date()
      await db.hold.update({ closed: holdClosed }, { where: { frn, holdCategoryId, closed: null } })
      await sendHoldEvent({ ...hold, closed: holdClosed }, REMOVED)
    }
  }
}

module.exports = { removeBulkHold }
