const { getPaymentSchemes } = require('../payment-scheme')

module.exports = [{
  method: 'GET',
  path: '/payment-schemes',
  options: {
    handler: async (request, h) => {
      return h.response({
        getPaymentSchemes
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
        })
      }
}]
