const { getSchemes, updateScheme } = require('../../schemes')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/payment-schemes',
  options: {
    handler: async (request, h) => {
      const paymentSchemes = await getSchemes()
      return h.response({
        paymentSchemes
      })
    }
  }
},
{
  method: 'POST',
  path: '/change-payment-status',
  options: {
    validate: {
      payload: joi.object({
        schemeId: joi.number().required(),
        active: joi.boolean().required()
      })
    },
    handler: async (request, h) => {
      try {
        await updateScheme(request.payload.schemeId, request.payload.active)
        return h.response('ok').code(200)
      } catch (err) {
        return h.response(err).code(500)
      }
    }
  }
}]
