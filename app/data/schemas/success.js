const Joi = require('joi')

module.exports = {
  success: Joi.boolean().required()
    .error(errors => {
      errors.forEach(err => {
        err.message = 'Success must be true or false'
      })
      return errors
    })
}
