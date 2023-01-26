const { BANK_ACCOUNT_ANOMALY, DAX_REJECTION } = require('../constants/hold-categories-names')

const getHoldCategoryName = (message) => {
  return message === 'Invalid bank details' ? BANK_ACCOUNT_ANOMALY : DAX_REJECTION
}

module.exports = getHoldCategoryName
