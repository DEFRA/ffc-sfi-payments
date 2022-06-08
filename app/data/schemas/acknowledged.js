const Joi = require('joi')

module.exports = {
  acknowledged: Joi.date().min('01/01/2000').max('now').required()
    .error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case 'date.min':
            err.message = 'Acknowledged must be a date after or on 01/01/2000'
            break
          case 'date.max':
            err.message = 'Acknowledged must be a date before or on today'
            break
          case 'date.base':
            err.message = 'Acknowledged must be a valid date'
            break
          default:
            err.message = 'Acknowledged must be a valid date'
            break
        }
      })
      return errors
    })
}
