const { SFI } = require('../../../app/constants/schemes')
const { SFI_INVOICE_NUMBER } = require('../values/invoice-number')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: SFI,
  invoiceNumber: SFI_INVOICE_NUMBER
}
