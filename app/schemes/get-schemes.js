const db = require('../data')

const getSchemes = async () => {
  return db.scheme.findAll()
}

module.exports = {
  getSchemes
}
