const { getPaymentHolds, getPaymentHoldCatgories, getPaymentHoldFrns, addPaymentHold, removePaymentHold } = require('../payment-hold')
const { convertPaymentHolds, convertPaymentHoldCategories, convertPaymentHoldFrns } = require('../payment-hold/utils')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const paymentHolds = convertPaymentHolds(await getPaymentHolds(request.query.open ?? false))

      return h.response({
        paymentHolds
      })
    }
  }
},
{
  method: 'GET',
  path: '/payment-hold-categories',
  options: {
    handler: async (request, h) => {
      const paymentHoldCategories = convertPaymentHoldCategories(await getPaymentHoldCatgories())

      return h.response({
        paymentHoldCategories
      })
    }
  }
},
{
  method: 'GET',
  path: '/payment-hold-frns',
  options: {
    handler: async (request, h) => {
      const paymentHoldFrns = convertPaymentHoldFrns(await getPaymentHoldFrns())

      return h.response({
        paymentHoldFrns
      })
    }
  }
},
{
  method: 'POST',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      await addPaymentHold(request.payload.frn, request.payload.holdCategoryId)
      return h.response('ok').code(200)
    }
  }
},
{
  method: 'POST',
  path: '/remove-payment-hold',
  options: {
    handler: async (request, h) => {
      await removePaymentHold(request.payload.holdId)
      return h.response('ok').code(200)
    }
  }
}]
