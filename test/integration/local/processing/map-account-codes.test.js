const mapAccountCodes = require('../../../../app/processing/map-account-codes')
const db = require('../../../../app/data')
const { AP, AR } = require('../../../../app/ledgers')
const { IRREGULAR, ADMINISTRATIVE } = require('../../../../app/debt-types')

describe('map account codes', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    await db.scheme.create({
      schemeId: 1,
      name: 'SFI'
    })

    await db.accountCode.create({
      accountCodeId: 1,
      schemeId: 1,
      lineDescription: 'G00 - Gross value of claim',
      accountCodeAP: 'SOS710',
      accountCodeARAdm: 'SOS750',
      accountCodeARIrr: 'SOS770'
    })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should map AP code for scheme code and description', async () => {
    const paymentRequest = {
      schemeId: 1,
      ledger: AP,
      invoiceLines: [{
        description: 'G00 - Gross value of claim'
      }]
    }
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('SOS710')
  })

  test('should map AR code for scheme code and description with administrative debt', async () => {
    const paymentRequest = {
      schemeId: 1,
      ledger: AR,
      debtType: ADMINISTRATIVE,
      invoiceLines: [{
        description: 'G00 - Gross value of claim'
      }]
    }
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('SOS750')
  })

  test('should map AR code for scheme code and description with irregular debt', async () => {
    const paymentRequest = {
      schemeId: 1,
      ledger: AR,
      debtType: IRREGULAR,
      invoiceLines: [{
        description: 'G00 - Gross value of claim'
      }]
    }
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('SOS770')
  })
})
