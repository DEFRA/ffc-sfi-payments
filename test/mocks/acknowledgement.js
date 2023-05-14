const { TIMESTAMP } = require('./values/date')
const { SFI_INVOICE_NUMBER } = require('./values/invoice-number')

module.exports = {
  invoiceNumber: SFI_INVOICE_NUMBER,
  acknowledged: TIMESTAMP,
  success: true
}
