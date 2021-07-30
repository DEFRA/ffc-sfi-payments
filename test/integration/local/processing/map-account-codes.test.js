const mapAccountCodes = require('../../../../app/processing/map-account-codes')

describe('map account codes', () => {
  test('should map AP code for arable soil gross', async () => {
    const paymentRequest = {
      ledger: 'AP',
      invoiceLines: [{
        lineDescription: 'G00 - Gross value of claim',
        schemeCode: '80001'
      }]
    }
    await mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('SOS273')
  })
})
