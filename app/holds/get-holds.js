const db = require('../data')

const getHolds = async (open = false) => {
  const where = open ? { closed: null } : {}
  return db.hold.findAll({
    where,
    include: [{
      model: db.holdCategory,
      as: 'holdCategory',
      attributes: []
    }],
    attributes: ['holdId', 'frn', [db.Sequelize.col('holdCategory.name'), 'holdCategoryName'], [db.Sequelize.col('added'), 'dateTimeAdded'], [db.Sequelize.col('closed'), 'dateTimeClosed']]
  })
}

module.exports = getHolds
