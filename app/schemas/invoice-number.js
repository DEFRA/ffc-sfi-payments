const Joi = require('joi')

module.exports = {
  invoiceNumber: Joi.string().required()
    .messages({ '*': 'Invoice number is invalid' })
}
