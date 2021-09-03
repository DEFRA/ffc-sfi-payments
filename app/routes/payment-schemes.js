const { getPaymentSchemes, updatePaymentScheme } = require('../payment-scheme')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/payment-schemes',
  options: {
    handler: async (request, h) => {
      const paymentSchemes = await getPaymentSchemes()
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
        schemeId: joi.string().required(),
        active: joi.boolean().required()
      })
    },
    handler: async (request, h) => {
      await updatePaymentScheme(request.payload.schemeId, request.payload.active)
      return h.response('ok').code(200)
    }
  }
}]
