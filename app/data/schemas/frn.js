const Joi = require('joi')

module.exports = {
  frn: Joi.number().integer().min(1000000000).max(9999999999).required()
    .error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case 'number.min':
            err.message = 'The FRN is too short, it must be 10 digits'
            break
          case 'number.max':
            err.message = 'The FRN is too long, it must be 10 digits'
            break
          case 'number.unsafe':
            err.message = 'The FRN is too long, it must be 10 digits'
            break
          case 'number.base':
            err.message = 'The FRN must be a 10 digit number'
            break
          default:
            err.message = 'The FRN is invalid, it must be 10 digits'
            break
        }
      })
      return errors
    })
}
