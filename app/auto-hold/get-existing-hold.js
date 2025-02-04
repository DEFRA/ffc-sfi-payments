const db = require('../data')

const getExistingHold = async (autoHoldCategoryId, paymentRequest, transaction) => {
  const { frn, marketingYear, agreementNumber } = paymentRequest
  return db.autoHold.findOne({
    transaction,
    where: { autoHoldCategoryId, frn, marketingYear, agreementNumber, closed: null }
  })
}

module.exports = {
  getExistingHold
}
