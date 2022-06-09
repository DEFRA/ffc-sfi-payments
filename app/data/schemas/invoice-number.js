const Joi = require('joi')

module.exports = {
  invoiceNumber: Joi.string().optional()
    .error(errors => {
      errors.forEach(err => {
        err.message = 'Invoice number is invalid'
      })
      return errors
    })
}
