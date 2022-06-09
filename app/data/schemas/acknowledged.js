const Joi = require('joi')

module.exports = {
  acknowledged: Joi.string().required()
    .messages({ '*': 'Acknowledged is invalid' })

}
