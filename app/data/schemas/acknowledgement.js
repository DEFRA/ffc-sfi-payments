const Joi = require('joi')
const acknowledgedSchema = require('./acknowledged')
const frnSchema = require('./frn')
const invoiceNumberSchema = require('./invoice-number')
const messageSchema = require('./message')
const successSchema = require('./success')

module.exports = Joi.object({
  ...acknowledgedSchema,
  ...frnSchema,
  ...invoiceNumberSchema,
  ...messageSchema,
  ...successSchema
})
