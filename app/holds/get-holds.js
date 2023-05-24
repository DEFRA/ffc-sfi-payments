const db = require('../data')

const getHolds = async (open = true) => {
  const where = open ? { closed: null } : {}
  return db.hold.findAll({
    where,
    include: [{
      model: db.holdCategory,
      as: 'holdCategory',
      attributes: [],
      include: [{
        model: db.scheme,
        as: 'scheme',
        attributes: []
      }]
    }
    ],
    raw: true,
    attributes: ['holdId', 'frn', [db.Sequelize.col('holdCategory.name'), 'holdCategoryName'], [db.Sequelize.col('holdCategory.scheme.schemeId'), 'holdCategorySchemeId'], [db.Sequelize.col('holdCategory.scheme.name'), 'holdCategorySchemeName'], [db.Sequelize.col('added'), 'dateTimeAdded'], [db.Sequelize.col('closed'), 'dateTimeClosed']]
  })
}

module.exports = {
  getHolds
}
