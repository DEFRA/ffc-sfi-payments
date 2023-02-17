const db = require('../data')
const { sendHoldEvent } = require('../event')

const removeHold = async (holdId) => {
  await db.hold.update({ closed: Date.now() }, { where: { holdId } })
  const hold = await db.hold.findByPk(holdId)
  await sendHoldEvent(hold, 'removed')
}

module.exports = removeHold
