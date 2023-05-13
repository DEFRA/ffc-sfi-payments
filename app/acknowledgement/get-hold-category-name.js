const { INVALID_BANK_DETAILS } = require('../constants/dax-rejections')
const { BANK_ACCOUNT_ANOMALY, DAX_REJECTION } = require('../constants/hold-categories-names')

const getHoldCategoryName = (message) => {
  return message === INVALID_BANK_DETAILS ? BANK_ACCOUNT_ANOMALY : DAX_REJECTION
}

module.exports = {
  getHoldCategoryName
}
