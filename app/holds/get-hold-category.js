const db = require('../data')

const getHoldCategory = async (holdCategoryId) => {
  return db.holdCategory.findByPk(holdCategoryId, {
    include: {
      model: db.scheme,
      as: 'scheme'
    }
  })
}

module.exports = getHoldCategory
