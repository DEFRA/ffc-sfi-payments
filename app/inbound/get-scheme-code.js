const db = require('../data')

const getSchemeCode = async (standardCode, transaction) => {
  const schemeCode = await db.schemeCode.findOne({ where: { standardCode } }, { transaction })
  return schemeCode?.schemeCode
}

module.exports = getSchemeCode
