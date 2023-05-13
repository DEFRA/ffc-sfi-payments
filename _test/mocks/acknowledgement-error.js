const acknowledged = require('./acknowledged')
const frn = require('./frn')
const invoiceNumber = require('./invoice-number')

module.exports = {
  invoiceNumber,
  frn,
  success: false,
  acknowledged,
  message: 'Journal JN12345678 has been created Validation failed Line : 21.'
}
