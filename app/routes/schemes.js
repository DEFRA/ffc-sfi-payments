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
  }
}]
