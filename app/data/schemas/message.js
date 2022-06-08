const Joi = require('joi')

module.exports = {
  message: Joi.string().optional()
    .error(errors => {
      errors.forEach(err => {
        err.message = 'Message is invalid'
      })
      return errors
    })
}
