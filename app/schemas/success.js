const Joi = require('joi')

module.exports = {
  success: Joi.boolean().required()
    .messages({ '*': 'Success must be true or false' })
}
