const Joi = require('joi')

module.exports = {
  message: Joi.string().optional()
    .messages({ '*': 'Message is invalid' })
}
