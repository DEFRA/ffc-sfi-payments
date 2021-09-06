const db = require('../data')

const getExistingHold = async (holdCategoryId, frn, transaction) => {
  return db.hold.findOne({
    transaction,
    lock: true,
    skipLocked: true,
    where: { holdCategoryId, frn }
  })
}

module.exports = getExistingHold
