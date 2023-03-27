const { REMOVED } = require('../constants/hold-statuses')
const db = require('../data')
const { sendHoldEvent } = require('../event')

const removeHold = async (holdId) => {
  await db.hold.update({ closed: Date.now() }, { where: { holdId } })
  const hold = await db.hold.findOne({ where: holdId, raw: true })
  await sendHoldEvent(hold, REMOVED)
}

module.exports = removeHold
