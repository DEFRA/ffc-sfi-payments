const db = require('../data')

const getHoldCategories = async (open = false) => {
  const where = open ? { closed: null } : {}
  return db.holdCategory.findAll({
    where,
    include: [{
      model: db.scheme,
      as: 'scheme',
      attributes: []
    }],
    raw: true,
    attributes: ['holdCategoryId', 'name', [db.Sequelize.col('scheme.schemeId'), 'schemeId'], [db.Sequelize.col('scheme.name'), 'schemeName']]
  })
}

module.exports = {
  getHoldCategories
}
