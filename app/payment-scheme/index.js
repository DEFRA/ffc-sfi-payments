const db = require('../data')

const getPaymentSchemes = async () => {
  return db.scheme.findAll()
}

const updatePaymentScheme = async (schemeId, active) => {
  await db.scheme.update({ active: active }, { where: { schemeId: schemeId } })
}

module.exports = {
  getPaymentSchemes,
  updatePaymentScheme
}
