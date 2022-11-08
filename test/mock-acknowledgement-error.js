const acknowledged = require('./mock-acknowledged')
const frn = require('./mock-frn')
const invoiceNumber = require('./mock-invoice-number')

module.exports = {
  invoiceNumber,
  frn,
  success: false,
  acknowledged,
  message: 'Journal JN12345678 has been created Validation failed Line : 21.'
}
