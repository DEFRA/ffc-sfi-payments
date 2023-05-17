const { FRN } = require('./values/frn')
const { INVOICE_NUMBER } = require('./values/invoice-number')
const { TIMESTAMP } = require('./values/date')

module.exports = {
  frn: FRN,
  invoiceNumber: INVOICE_NUMBER,
  settlementDate: TIMESTAMP,
  settled: true,
  value: 150
}
