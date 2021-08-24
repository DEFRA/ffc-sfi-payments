const { getHolds, addHold, removeHold, getHoldCategories } = require('../holds')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const paymentHolds = await getHolds(request.query.open)
      return h.response({ paymentHolds })
    }
  }
},
{
  method: 'GET',
  path: '/payment-hold-categories',
  options: {
    handler: async (request, h) => {
      const paymentHoldCategories = await getHoldCategories()
      return h.response({ paymentHoldCategories })
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
      }),
      failAction: (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await addHold(request.payload.frn, request.payload.holdCategoryId)
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
      }),
      failAction: (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await removeHold(request.payload.holdId)
      return h.response('ok').code(200)
    }
  }
}]
