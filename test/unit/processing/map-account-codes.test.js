jest.mock('../../../app/data')
const { ADMINISTRATIVE, IRREGULAR } = require('../../../app/constants/debt-types')
const { AP, AR } = require('../../../app/constants/ledgers')
const { SFI, CS, MANUAL } = require('../../../app/constants/schemes')
const db = require('../../../app/data')
const mapAccountCodes = require('../../../app/processing/map-account-codes')

const accountCodeAP = 'APCode'
const accountCodeARAdm = 'ARAdmCode'
const accountCodeARIrr = 'ARIrrCode'

let paymentRequest

describe('map account codes', () => {
  beforeEach(() => {
    paymentRequest = {
      schemeId: SFI,
      ledger: AP,
      invoiceLines: [{
        description: 'G00 - Gross value of claim'
      }]
    }

    db.accountCode.findOne.mockResolvedValue({
      accountCodeAP,
      accountCodeARAdm,
      accountCodeARIrr
    })
  })

  test('should map AP code for AP payment request', async () => {
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe(accountCodeAP)
  })

  test('should map AR code for AR payment request with administrative debt', async () => {
    paymentRequest.schemeId = SFI
    paymentRequest.ledger = AR
    paymentRequest.debtType = ADMINISTRATIVE
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe(accountCodeARAdm)
  })

  test('should map AR code for AR payment request with irregular debt', async () => {
    paymentRequest.schemeId = SFI
    paymentRequest.ledger = AR
    paymentRequest.debtType = IRREGULAR
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe(accountCodeARIrr)
  })

  test('should not map account code for CS payment request', async () => {
    paymentRequest.schemeId = CS
    paymentRequest.invoiceLines[0].accountCode = 'ExistingCode'
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('ExistingCode')
  })

  test('should not map account code for Manual Invoice payment request', async () => {
    paymentRequest.schemeId = MANUAL
    paymentRequest.invoiceLines[0].accountCode = 'ExistingCode'
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('ExistingCode')
  })
})
