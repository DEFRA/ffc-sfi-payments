const db = require('../data')

const getSchemeId = async (holdCategoryId, autoHoldCategoryId, transaction) => {
  if (holdCategoryId) {
    const holdCategory = await db.holdCategory.findOne({ where: { holdCategoryId }, transaction })
    return holdCategory?.schemeId
  }
  const holdCategory = await db.autoHoldCategory.findOne({ where: { autoHoldCategoryId }, transaction })
  return holdCategory?.schemeId
}

module.exports = {
  getSchemeId
}
