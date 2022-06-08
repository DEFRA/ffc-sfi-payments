const Joi = require('joi')

module.exports = {
  frn: Joi.number().integer().min(999999999).max(10000000000).required()
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
