const db = require('../data')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      var holds = await db.hold.findAll({
        include: [
          {
            model: db.holdCategory, as: 'holdCategory'
          }
        ]
      })

      const paymentHolds = []

      if (holds) {
        for (const hold of holds) {
          const payment = {
            holdId: hold.holdId,
            frn: hold.frn,
            holdCategoryName: hold.holdCategory.name,
            dateTimeAdded: hold.added,
            dateTimeClosed: hold.closed
          }
          paymentHolds.push(payment)
        }
      }

      return h.response({
        paymentHolds
      })
    }
  }
}]
