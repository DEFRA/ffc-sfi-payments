const db = require('../data')

const getDeliveryBody = async (schemeId, transaction) => {
  const deliveryBody = await db.deliveryBody.findOne({ where: { schemeId } }, { transaction })
  return deliveryBody?.deliveryBody
}

module.exports = getDeliveryBody
