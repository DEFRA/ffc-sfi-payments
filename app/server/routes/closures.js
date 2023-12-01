const { getClosureCount, getClosures, addClosure, addBulkClosure, removeClosureById } = require('../../closures')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/closures',
  options: {
    handler: async (request, h) => {
      const closures = await getClosureCount()
      return h.response({
        closures
      })
    }
  }
},
{
  method: 'GET',
  path: '/closure',
  options: {
    handler: async (request, h) => {
      const closures = await getClosures(request.query.open)
      return h.response({ closures })
    }
  }
},
{
  method: 'POST',
  path: '/closure/add',
  options: {
    handler: async (request, h) => {
      await addClosure(request.payload.frn, request.payload.agreement, request.payload.date)
      return h.response('ok').code(200)
    }
  }
},
{
  method: 'POST',
  path: '/closure/bulk',
  options: {
    handler: async (request, h) => {
      await addBulkClosure(request.payload.data)
      return h.response('ok').code(200)
    }
  }
},
{
  method: 'POST',
  path: '/closure/remove',
  options: {
    validate: {
      payload: joi.object({
        closedId: joi.number().required()
      }),
      failAction: (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await removeClosureById(request.payload.closedId)
      return h.response('ok').code(200)
    }
  }
}]
