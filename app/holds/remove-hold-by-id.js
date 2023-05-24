const db = require('../data')
const { REMOVED } = require('../constants/hold-statuses')
const { sendHoldEvent } = require('../event')

const removeHoldById = async (holdId) => {
  await db.hold.update({ closed: Date.now() }, { where: { holdId } })
  const hold = await db.hold.findOne({ where: holdId, raw: true })
  await sendHoldEvent(hold, REMOVED)
}

module.exports = {
  removeHoldById
}
