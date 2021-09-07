const db = require('../data')

const addHold = async (frn, holdCategoryId, transaction) => {
  await db.hold.create({ frn, holdCategoryId, added: Date.now() }, { transaction })
}

module.exports = addHold
