const db = require('../data')

const getFundCode = async (schemeId, transaction) => {
  const fundCode = await db.fundCode.findOne({ where: { schemeId } }, { transaction })
  return fundCode?.fundCode
}

module.exports = getFundCode
