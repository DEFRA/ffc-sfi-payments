const { getPaymentHolds, addPaymentHold, removePaymentHold, getPaymentHoldCategories } = require('../payment-hold')
const { convertPaymentHolds, convertPaymentHoldCategories } = require('../payment-hold/utils')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const paymentHolds = convertPaymentHolds(await getPaymentHolds(request.query.open))
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
      const paymentHoldCategories = convertPaymentHoldCategories(await getPaymentHoldCategories())
      return h.response({
        paymentHoldCategories
      })
    }
  }
},
{
  method: 'POST',
  path: '/add-payment-hold',
  options: {
    validate: {
      payload: joi.object({
        frn: joi.number().required(),
        holdCategoryId: joi.string().required()
      })
    },
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
    validate: {
      payload: joi.object({
        holdId: joi.number().required()
      })
    },
    handler: async (request, h) => {
      await removePaymentHold(request.payload.holdId)
      return h.response('ok').code(200)
    }
  }
}]
