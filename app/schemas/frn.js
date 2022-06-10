const Joi = require('joi')

module.exports = {
  frn: Joi.number().integer().min(1000000000).max(9999999999).required()
    .messages({
      'number.min': 'The FRN is too short, it must be 10 digits',
      'number.max': 'The FRN is too long, it must be 10 digits',
      'number.base': 'The FRN must be a 10 digit number',
      '*': 'The FRN is invalid, it must be 10 digits'
    })
}
