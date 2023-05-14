const db = require('../../app/data')
const scheme = require('../mocks/scheme')
const holdCategory = require('../mocks/holds/hold-category')

const resetDatabase = async () => {
  await db.sequelize.truncate({ cascade: true })
  await db.scheme.create(scheme)
  await db.holdCategory.create(holdCategory)
}

module.exports = {
  resetDatabase
}
