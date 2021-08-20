const { getPaymentSchemes } = require('../payment-hold')

module.exports = [{
  method: 'GET',
  path: '/payment-schemes',
  options: {
    handler: async (request, h) => {
      return h.response({
        getPaymentSchemes
      })
    }
  }
}]
