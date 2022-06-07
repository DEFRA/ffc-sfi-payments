const Joi = require('joi')

module.exports = {
  acknowledged: Joi.string().required()
    .error(errors => {
      errors.forEach(err => {
        err.message = 'Acknowledged is invalid.'
      })
      return errors
    })
}
