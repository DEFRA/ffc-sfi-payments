const moment = require('moment')
const db = require('../../data')

const getPending = async (started, transaction) => {
  return db.schedule.findAll({
    where: {
      completed: null,
      started: { [db.Sequelize.Op.gt]: moment(started).subtract(5, 'minutes').toDate() }
    },
    include: [{
      model: db.paymentRequest,
      as: 'paymentRequest'
    }],
    transaction
  })
}

module.exports = {
  getPending
}
