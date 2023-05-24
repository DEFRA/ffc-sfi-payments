const db = require('../data')

const getHold = async (holdId) => {
  return db.hold.findByPk(holdId, {
    include: {
      model: db.holdCategory,
      as: 'holdCategory',
      include: {
        model: db.scheme,
        as: 'scheme'
      }
    }
  })
}

module.exports = {
  getHold
}
