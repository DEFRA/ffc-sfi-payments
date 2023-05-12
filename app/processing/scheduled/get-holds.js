const db = require('../../data')

const getHolds = async (transaction) => {
  return db.hold.findAll({
    where: { closed: null },
    include: [{
      model: db.holdCategory,
      as: 'holdCategory'
    }],
    transaction
  })
}

module.exports = {
  getHolds
}
