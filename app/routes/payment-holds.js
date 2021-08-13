const db = require('../data')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const holds = await db.hold.findAll()
      return h.response({
        holds
      })
    }
  }
}]
