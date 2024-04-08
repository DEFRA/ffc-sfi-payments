const { FRN } = require('../values/frn')
const { INVOICE_NUMBER } = require('../values/invoice-number')
const { TIMESTAMP } = require('../values/date')
const { GBP } = require('../../../app/constants/currency')

module.exports = {
  frn: FRN,
  currency: GBP,
  invoiceNumber: INVOICE_NUMBER,
  settlementDate: TIMESTAMP,
  settled: true,
  value: 150
}
