const db = require('../data')

const getClosures = async () => {
  return db.frnAgreementClosed.findAll()
}

module.exports = {
  getClosures
}
