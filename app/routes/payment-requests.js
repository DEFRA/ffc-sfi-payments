const { Boom } = require('@hapi/boom')
const Joi = require('joi')
const { resetPaymentRequestByInvoiceNumber } = require('../reset')

module.exports = [{
  method: 'POST',
  path: '/payment-request/reset',
  options: {
    validate: {
      payload: Joi.object({
        invoiceNumber: Joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return Boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      try {
        await resetPaymentRequestByInvoiceNumber(request.payload.invoiceNumber)
        return h.response('ok').code(200)
      } catch (err) {
        return Boom.preconditionFailed(err)
      }
    }
  }
}]
