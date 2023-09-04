const db = require('../data')

const getClosedFRN = async (frn) => {
  return db.frnClosed.findByPk(frn)
}

module.exports = {
  getClosedFRN
}
