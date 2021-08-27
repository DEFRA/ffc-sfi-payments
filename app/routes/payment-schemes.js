const { getPaymentSchemes } = require('../payment-scheme')
 
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
 },
  {
    method: 'POST',
    path: '/change-status',
    options: {
      validate: {
        payload: joi.object({
          name: joi.string().required(),
          active: joi.boolean().required()
          handler: async (request, h) => {
            await updateScheme(request.payload.active)
            return h.response('ok').code(200)
      
        })
      }
}]
