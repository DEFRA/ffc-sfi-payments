const db = require('../../app/data')
const scheme = require('../mocks/scheme')

const resetDatabase = async () => {
  await db.sequelize.truncate({ cascade: true })
  await db.scheme.create(scheme)
}

module.exports = {
  resetDatabase
}
