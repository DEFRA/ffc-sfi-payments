const db = require('../data')

const getHoldCategoryId = async (schemeId, name, transaction) => {
  const holdCategory = await db.holdCategory.findOne({ where: { schemeId, name }, transaction })
  return holdCategory?.holdCategoryId
}

module.exports = getHoldCategoryId
