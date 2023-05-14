const db = require('../data')

const getHoldCategories = async () => {
  return db.holdCategory.findAll({
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
