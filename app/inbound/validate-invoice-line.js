const schema = require('./schemas/invoice-line')

const validateInvoiceLine = (invoiceLine) => {
  const validationResult = schema.validate(invoiceLine)
  if (validationResult.error) {
    throw new Error(`Invoice line is invalid. ${validationResult.error.message}`)
  }
}

module.exports = validateInvoiceLine
