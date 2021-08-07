const db = require('../data')

const getSchemeId = async (sourceSystem, transaction) => {
  const source = await db.sourceSystem.findOne({ where: { name: sourceSystem } }, { transaction })
  return source?.schemeId
}

module.exports = getSchemeId
