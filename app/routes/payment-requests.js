const { Boom } = require('@hapi/boom')
const Joi = require('joi')

module.exports = [{
  method: 'POST',
  path: '/payment-request/reset',
  options: {
    validate: {
      payload: Joi.object({
        invoiceNumber: Joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return Boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return h.response('ok').code(200)
    }
  }
}]
