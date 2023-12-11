const db = require('../data')

const getClosureCount = async () => {
  return db.frnAgreementClosed.findAll()
}

module.exports = {
  getClosureCount
}
