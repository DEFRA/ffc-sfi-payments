const mapAccountCodes = require('../../../../app/processing/map-account-codes')
const db = require('../../../../app/data')
const { AP, AR } = require('../../../../app/ledgers')

describe('map account codes', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    await db.schemeCode.create({
      schemeCodeId: 1,
      schemeCode: '80001'
    })

    await db.accountCode.create({
      accountCodeId: 1,
      schemeCodeId: 1,
      lineDescription: 'G00 - Gross value of claim',
      accountCodeAP: 'SOS273',
      accountCodeAR: 'SOS274'
    })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should map AP code for scheme code and description', async () => {
    const paymentRequest = {
      ledger: AP,
      invoiceLines: [{
        description: 'G00 - Gross value of claim',
        schemeCode: '80001'
      }]
    }
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('SOS273')
  })

  test('should map AR code for scheme code and description', async () => {
    const paymentRequest = {
      ledger: AR,
      invoiceLines: [{
        description: 'G00 - Gross value of claim',
        schemeCode: '80001'
      }]
    }
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('SOS274')
  })
})
