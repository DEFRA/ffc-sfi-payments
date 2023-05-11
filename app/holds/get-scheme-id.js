const db = require('../data')

const getSchemeId = async (holdCategoryId, transaction) => {
  const holdCategory = await db.holdCategory.findOne({ where: { holdCategoryId }, transaction })
  return holdCategory?.schemeId
}

module.exports = {
  getSchemeId
}
