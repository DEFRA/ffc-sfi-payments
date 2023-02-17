const db = require('../data')
const { sendHoldEvent } = require('../event')

const addHold = async (frn, holdCategoryId, transaction) => {
  const hold = await db.hold.create({ frn, holdCategoryId, added: Date.now() }, { transaction })
  await sendHoldEvent(hold, 'added')
}

module.exports = addHold
