const db = require('../data')

const updateScheme = async (schemeId, active) => {
  await db.scheme.update({ active }, { where: { schemeId } })
}

module.exports = {
  updateScheme
}
