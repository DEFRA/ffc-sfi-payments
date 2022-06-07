const Joi = require('joi')

const LENGTH = 21

module.exports = {
  invoiceNumber: Joi.string().regex(/^\w{21}$/).required()
    .error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case 'string.empty':
            err.message = 'The invoice number cannot be empty.'
            break
          case 'string.pattern.base':
            if (err.local.value.length < LENGTH) {
              err.message = `The invoice number is too short. It must be ${LENGTH} characters.`
            } else if (err.local.value.length > LENGTH) {
              err.message = `The invoice number is too long. It must be ${LENGTH} characters.`
            } else {
              err.message = 'The invoice number can only have alphanumeric characters.'
            }
            break
          default:
            err.message = 'The invoice number is invalid.'
            break
        }
      })
      return errors
    })
}
