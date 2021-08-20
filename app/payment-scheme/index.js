const db = require('../data')

const getPaymentSchemes = async () => {
  return db.scheme.findAll()
}

module.exports = {
  getPaymentSchemes
}
