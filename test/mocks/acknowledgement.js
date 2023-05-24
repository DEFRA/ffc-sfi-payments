const { INVOICE_NUMBER } = require('./values/invoice-number')
const { TIMESTAMP } = require('./values/date')
const { INVALID_BANK_DETAILS } = require('../../app/constants/dax-rejections')

module.exports = {
  invoiceNumber: INVOICE_NUMBER,
  acknowledged: TIMESTAMP,
  success: true,
  message: INVALID_BANK_DETAILS
}
