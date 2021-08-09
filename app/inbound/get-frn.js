const db = require('../data')

const getFrn = async (sbi, transaction) => {
  const frn = await db.frn.findOne({ where: { sbi } }, { transaction })
  return Number(frn?.frn ?? 0)
}

module.exports = getFrn
