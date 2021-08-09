const Joi = require('joi')

module.exports = Joi.object({
  standardCode: Joi.string(),
  schemeCode: Joi.string(),
  accountCode: Joi.string(),
  fundCode: Joi.string(),
  description: Joi.string(),
  value: Joi.number().required()
})
