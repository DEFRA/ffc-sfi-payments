const db = require('../data')

const hasAutoHold = async (paymentRequest, transaction) => {
  const { schemeId, frn, marketingYear } = paymentRequest
  const autoHold = await db.autoHold.findOne({
    transaction,
    where: {
      frn,
      [db.Sequelize.Op.or]: [
        { marketingYear: null },
        { marketingYear }
      ],
      closed: null
    }
  })
  if (autoHold) {
    const autoHoldCategory = await db.autoHoldCategory.findOne({
      where: { autoHoldCategoryId: autoHold.autoHoldCategoryId }
    })
    if (autoHoldCategory && autoHoldCategory.schemeId === schemeId) {
      return true
    }
  }
  return false
}

module.exports = {
  hasAutoHold
}
