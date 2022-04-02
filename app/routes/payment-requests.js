const Joi = require('joi')

module.exports = [{
  method: 'POST',
  path: '/payment-request/reset',
  options: {
    validate: {
      payload: Joi.object({
        invoiceNumber: Joi.string().required()
      })
    },
    handler: async (request, h) => {
      return h.response('ok').code(200)
    }
  }
}]
