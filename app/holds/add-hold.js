const db = require('../data')

const addHold = async (frn, holdCategoryId) => {
  await db.hold.create({ frn: frn, holdCategoryId: holdCategoryId, added: Date.now() })
}

module.exports = addHold
