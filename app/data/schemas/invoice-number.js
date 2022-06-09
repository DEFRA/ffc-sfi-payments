const Joi = require('joi')

module.exports = {
  invoiceNumber: Joi.string().optional()
    .messages({ '*': 'Invoice number is invalid' })
}
