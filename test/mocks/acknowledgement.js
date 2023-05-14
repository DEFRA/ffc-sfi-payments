const { INVALID_BANK_DETAILS } = require('../../app/constants/dax-rejections')
const { TIMESTAMP } = require('./values/date')
const { INVOICE_NUMBER } = require('./values/invoice-number')

module.exports = {
  invoiceNumber: INVOICE_NUMBER,
  acknowledged: TIMESTAMP,
  success: true,
  message: INVALID_BANK_DETAILS
}
