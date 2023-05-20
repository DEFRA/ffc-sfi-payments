const { GBP } = require('../../../app/constants/currency')
const { AP } = require('../../../app/constants/ledgers')
const { Q4 } = require('../../../app/constants/schedules')
const { SFI } = require('../../../app/constants/schemes')
const { AGREEMENT_NUMBER } = require('../values/agreement-number')
const { BATCH } = require('../values/batch')
const { CONTRACT_NUMBER } = require('../values/contract-number')
const { CORRELATION_ID } = require('../values/correlation-id')
const { DELIVERY_BODY_RPA } = require('../values/delivery-body')
const { PENALTY_DESCRIPTION } = require('../values/description')
const { DUE_DATE } = require('../values/due-date')
const { FRN } = require('../values/frn')
const { INVOICE_NUMBER } = require('../values/invoice-number')
const { MARKETING_YEAR } = require('../values/marketing-year')
const { PAYMENT_REQUEST_NUMBER } = require('../values/payment-request-number')
const { SBI } = require('../values/sbi')
const { SOURCE_SYSTEM } = require('../values/source-system')
const { BALANCE } = require('../values/payment-type')
const invoiceLine = require('./invoice-line')

module.exports = {
  correlationId: CORRELATION_ID,
  schemeId: SFI,
  sourceSystem: SOURCE_SYSTEM,
  batch: BATCH,
  deliveryBody: DELIVERY_BODY_RPA,
  invoiceNumber: INVOICE_NUMBER,
  frn: FRN,
  sbi: SBI,
  paymentRequestNumber: PAYMENT_REQUEST_NUMBER,
  agreementNumber: AGREEMENT_NUMBER,
  contractNumber: CONTRACT_NUMBER,
  paymentType: BALANCE,
  marketingYear: MARKETING_YEAR,
  currency: GBP,
  schedule: Q4,
  dueDate: DUE_DATE,
  value: 100,
  ledger: AP,
  invoiceLines: [{
    ...invoiceLine,
    value: 100
  }]
}
