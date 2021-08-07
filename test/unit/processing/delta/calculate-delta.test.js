const calculateDelta = require('../../../../app/processing/delta')

describe('calculate delta', () => {
  test('should calculate top up as single request', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 80,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 80
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests.length).toBe(1)
  })

  test('should calculate top up as AP if all settled', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 80,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 80
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests[0].ledger).toBe('AP')
  })

  test('should calculate top up value', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 80,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 80
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests[0].value).toBe(20)
  })

  test('should calculate top up line value', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 80,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 80
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests[0].invoiceLines.length).toBe(1)
    expect(updatedPaymentRequests[0].invoiceLines[0].value).toBe(20)
  })

  test('should calculate recovery as single request', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 200,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 200
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests.length).toBe(1)
  })

  test('should calculate recovery as AR if all settled', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 200,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 200
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests[0].ledger).toBe('AR')
  })

  test('should calculate recovery value', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 200,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 200
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests[0].value).toBe(-100)
  })

  test('should calculate recovery line value', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 100,
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 100
      }]
    }
    const previousPaymentRequests = [{
      ledger: 'AP',
      value: 200,
      settled: new Date(2022, 3, 5),
      invoiceLines: [{
        schemeCode: '80001',
        fundCode: 'DRD10',
        description: 'G00',
        value: 200
      }]
    }]
    const updatedPaymentRequests = calculateDelta(paymentRequest, previousPaymentRequests)
    expect(updatedPaymentRequests[0].invoiceLines.length).toBe(1)
    expect(updatedPaymentRequests[0].invoiceLines[0].value).toBe(-100)
  })
})
