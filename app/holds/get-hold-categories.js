const db = require('../data')

const getHoldCategories = async () => {
  return db.holdCategory.findAll({
    attributes: ['holdCategoryId', 'name']
  })
}

module.exports = getHoldCategories
