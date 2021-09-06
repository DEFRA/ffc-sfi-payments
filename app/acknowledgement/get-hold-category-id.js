const db = require('../data')

const getHoldCategoryId = async (schemeId, name, transaction) => {
  const { holdCategoryId } = await db.holdCategory.findOne({ where: { schemeId, name }, transaction })
  return holdCategoryId
}

module.exports = getHoldCategoryId
