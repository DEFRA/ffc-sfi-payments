const Joi = require('joi')

module.exports = Joi.object({
  sourceSystem: Joi.string().allow(''),
  deliveryBody: Joi.string().allow(''),
  invoiceNumber: Joi.string().allow(''),
  frn: Joi.number().greater(1000000000).less(9999999999).optional(),
  sbi: Joi.number().integer().greater(105000000).less(999999999).optional(),
  marketingYear: Joi.number().integer().greater(2021).less(2099),
  paymentRequestNumber: Joi.number().required(),
  agreementNumber: Joi.string(),
  contractNumber: Joi.string(),
  currency: Joi.string(),
  schedule: Joi.string(),
  dueDate: Joi.string(),
  debtType: Joi.string().allow(''),
  recoveryDate: Joi.string().allow(''),
  originalSettlementDate: Joi.string().allow(''),
  value: Joi.number().required(),
  invoiceLines: Joi.array().required().items(Joi.object({
    standardCode: Joi.string().required(),
    accountCode: Joi.string().required(),
    fundCode: Joi.string().required(),
    description: Joi.string().required(),
    value: Joi.number().required()
  }))
})
