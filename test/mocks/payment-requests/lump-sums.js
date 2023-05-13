const { LUMP_SUMS } = require('../../../app/constants/schemes')
const { LUMP_SUMS_INVOICE_NUMBER } = require('../values/invoice-number')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: LUMP_SUMS,
  invoiceNumber: LUMP_SUMS_INVOICE_NUMBER
}
