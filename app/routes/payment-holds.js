const db = require('../data')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const holds = await db.hold.findAll(
        {
          include: [{
            model: db.holdCategory,
            required: true
          }
          ]
        })
      return h.response({
        holds
      })
    }
  }
}]
