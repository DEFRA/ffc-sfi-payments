const joi = require('joi')
const { getClosures, addClosure, addBulkClosure } = require('../../closures')

module.exports = [{
  method: 'GET',
  path: '/agreement-closures',
  options: {
    handler: async (request, h) => {
      const closures = await getClosures()
      return h.response({
        closures
      })
    }
  }
},
{
  method: 'POST',
  path: '/closure',
  options: {
    handler: async (request, h) => {
      await addClosure(request.payload.frn, request.payload.agreement, request.payload.date)
      return h.response('ok').code(200)
    }
  }
},
{
  method: 'POST',
  path: '/bulk-closure',
  options: {
    handler: async (request, h) => {
      await addBulkClosure(request.payload.data)
      return h.response('ok').code(200)
    }
  }
}]
