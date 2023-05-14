const { ensureValueConsistency } = require('../../../../../app/processing/delta/assign-ledger/ensure-value-consistency')

describe('ensure value consistency', () => {
  test('should not change lines if value consistent', () => {
    const paymentRequest = {
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 99
      }, {
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 1
      }]
    }

    ensureValueConsistency(paymentRequest)
    expect(paymentRequest.invoiceLines[0].value).toBe(99)
    expect(paymentRequest.invoiceLines[1].value).toBe(1)
  })

  test('should update first gross lines if value not consistent', () => {
    const paymentRequest = {
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 98
      }, {
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 1
      }]
    }

    ensureValueConsistency(paymentRequest)
    expect(paymentRequest.invoiceLines[0].value).toBe(99)
    expect(paymentRequest.invoiceLines[1].value).toBe(1)
  })

  test('should update first gross lines if value not consistent when penalties', () => {
    const paymentRequest = {
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 97
      }, {
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'P02',
        value: -1
      }, {
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 1
      }]
    }

    ensureValueConsistency(paymentRequest)
    expect(paymentRequest.invoiceLines[0].value).toBe(100)
  })

  test('should update first lines if value not consistent and no gross', () => {
    const paymentRequest = {
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'P25',
        value: 98
      }, {
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'P25',
        value: 1
      }]
    }

    ensureValueConsistency(paymentRequest)
    expect(paymentRequest.invoiceLines[0].value).toBe(99)
    expect(paymentRequest.invoiceLines[1].value).toBe(1)
  })
})
