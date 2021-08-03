const Joi = require('joi')

module.exports = Joi.object({
  sourceSystem: Joi.string().required(),
  deliveryBody: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  frn: Joi.number().required(),
  sbi: Joi.number().integer().greater(105000000).less(999999999).required(),
  paymentRequestNumber: Joi.number().required(),
  agreementNumber: Joi.string().required(),
  contractNumber: Joi.string().required(),
  currency: Joi.string().required(),
  schedule: Joi.string().required(),
  dueDate: Joi.date().required(),
  value: Joi.number().required(),
  invoiceLines: Joi.array().required().items(Joi.object({
    standardCode: Joi.number().required(),
    accountCode: Joi.string().required(),
    fundCode: Joi.string().required(),
    description: Joi.string().required(),
    value: Joi.number().required()
  }))
})
