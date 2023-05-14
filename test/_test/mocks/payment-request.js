const { SFI } = require('../../../app/constants/schemes')
const { GBP } = require('../../../app/constants/currency')
const { M12 } = require('../../../app/constants/schedules')
const { AP } = require('../../../app/constants/ledgers')

module.exports = {
  correlationId: 'f9721145-e52f-4e8d-be8e-e6c219286a72',
  schemeId: SFI,
  sourceSystem: 'SFIP',
  deliveryBody: 'RP00',
  invoiceNumber: 'SFI00000001',
  frn: 1234567890,
  sbi: 123456789,
  paymentRequestNumber: 1,
  agreementNumber: 'SIP00000000001',
  contractNumber: 'SFIP000001',
  marketingYear: 2022,
  currency: GBP,
  schedule: M12,
  dueDate: '15/08/2021',
  value: 150.00,
  ledger: AP,
  invoiceLines: [{
    accountCode: 'SOS273',
    fundCode: 'DRD10',
    description: 'G00 - Gross value of claim',
    value: 250.00
  },
  {
    accountCode: 'SOS273',
    fundCode: 'DRD10',
    description: 'P02 - Over declaration penalty',
    value: -100.00
  }]
}
