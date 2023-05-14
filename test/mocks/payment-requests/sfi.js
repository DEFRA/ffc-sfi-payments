const { SFI } = require('../../../app/constants/schemes')
const { INVOICE_NUMBER } = require('../values/invoice-number')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: SFI,
  invoiceNumber: INVOICE_NUMBER
}
