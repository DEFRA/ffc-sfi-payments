const { FDMR } = require('../../../app/constants/schemes')
const { FDMR_INVOICE_NUMBER } = require('../values/invoice-number')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: FDMR,
  invoiceNumber: FDMR_INVOICE_NUMBER
}
