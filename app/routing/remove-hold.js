const db = require('../data')
const { getHoldCategoryId } = require('../holds')

const removeHold = async (schemeId, frn, holdCategoryName) => {
  const holdCategoryId = await getHoldCategoryId(schemeId, holdCategoryName)
  await db.hold.update({ closed: new Date() }, { where: { frn, holdCategoryId } })
}

module.exports = {
  removeHold
}
