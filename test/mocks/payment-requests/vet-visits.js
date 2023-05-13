const { VET_VISITS } = require('../../../app/constants/schemes')
const { VET_VISITS_INVOICE_NUMBER } = require('../values/invoice-number')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: VET_VISITS,
  invoiceNumber: VET_VISITS_INVOICE_NUMBER
}
