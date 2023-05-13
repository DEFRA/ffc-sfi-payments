const { CS } = require('../../../app/constants/schemes')
const { CS_INVOICE_NUMBER } = require('../values/invoice-number')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: CS,
  invoiceNumber: CS_INVOICE_NUMBER
}
