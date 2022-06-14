const acknowledged = require('./mockAcknowledged')
const frn = require('./mockFrn')
const invoiceNumber = require('./mockInvoiceNumber')

module.exports = {
  invoiceNumber,
  frn,
  success: false,
  acknowledged,
  message: 'Journal JN12345678 has been created Validation failed Line : 21.'
}
