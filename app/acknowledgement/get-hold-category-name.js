const getHoldCategoryName = (message) => {
  return message === 'Invalid bank details' ? message : 'DAX rejection'
}

module.exports = getHoldCategoryName
