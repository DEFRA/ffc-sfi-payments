const db = require('../data')

module.exports = [{
  method: 'GET',
  path: '/holds',
  options: {
    handler: async (request, h) => {
      await db()
      const holds = await db.hold.findAll()
      return h.response({
        holds
      })
    }
  }
}]
