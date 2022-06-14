const Joi = require('joi')
const acknowledgedSchema = require('../../schemas/acknowledged')
const frnSchema = require('../../schemas/frn')
const invoiceNumberSchema = require('../../schemas/invoice-number')
const messageSchema = require('../../schemas/message')
const successSchema = require('../../schemas/success')

module.exports = Joi.object({
  ...acknowledgedSchema,
  ...frnSchema,
  ...invoiceNumberSchema,
  ...messageSchema,
  ...successSchema
})
