const holdCategoryName = require('../constants/hold-categories-names')

const getHoldCategoryName = (message) => {
  return message === 'Invalid bank details' ? holdCategoryName.BANK_ACCOUNT_ANOMALY : holdCategoryName.DAX_REJECTION
}

module.exports = getHoldCategoryName
