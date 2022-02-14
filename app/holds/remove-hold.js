const db = require('../data')

const removeHold = async (holdId) => {
  await db.hold.update({ closed: Date.now() }, { where: { holdId } })
}

module.exports = removeHold
