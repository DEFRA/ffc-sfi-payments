const getHoldCategoryName = (message) => {
  return message === 'Invalid bank details' ? 'Bank account anomaly' : 'DAX rejection'
}

module.exports = getHoldCategoryName
