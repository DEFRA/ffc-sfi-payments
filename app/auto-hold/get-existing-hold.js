const db = require('../data')

const getExistingHold = async (autoHoldCategoryId, paymentRequest, transaction) => {
  const { frn, marketingYear, agreementNumber, contractNumber } = paymentRequest
  return db.autoHold.findOne({
    transaction,
    where: { autoHoldCategoryId, frn, marketingYear, agreementNumber, contractNumber, closed: null }
  })
}

module.exports = {
  getExistingHold
}
