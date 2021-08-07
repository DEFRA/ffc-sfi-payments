const getUnsettled = require('../../../../app/processing/delta/get-unsettled')

describe('get unsettled', () => {
  test('should return zero for both ledger if no unsettled', () => {
    const paymentRequests = [{
      ledger: 'AP',
      value: 100,
      settled: new Date(2022, 6, 5)
    }, {
      ledger: 'AR',
      value: -100,
      settled: new Date(2022, 6, 5)
    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.AP).toBe(0)
    expect(unsettled.AR).toBe(0)
  })

  test('should return hasUnsettled false if no unsettled', () => {
    const paymentRequests = [{
      ledger: 'AP',
      value: 100,
      settled: new Date(2022, 6, 5)
    }, {
      ledger: 'AR',
      value: -100,
      settled: new Date(2022, 6, 5)
    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.hasUnsettled).toBe(false)
  })

  test('should return AP value if AP unsettled', () => {
    const paymentRequests = [{
      ledger: 'AP',
      value: 100
    }, {
      ledger: 'AR',
      value: -100,
      settled: new Date(2022, 6, 5)
    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.AP).toBe(100)
    expect(unsettled.AR).toBe(0)
  })

  test('should return AR value if AR unsettled', () => {
    const paymentRequests = [{
      ledger: 'AP',
      value: 100,
      settled: new Date(2022, 6, 5)
    }, {
      ledger: 'AR',
      value: -100

    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.AP).toBe(0)
    expect(unsettled.AR).toBe(100)
  })

  test('should return values if both unsettled', () => {
    const paymentRequests = [{
      ledger: 'AP',
      value: 100
    }, {
      ledger: 'AR',
      value: -100

    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.AP).toBe(100)
    expect(unsettled.AR).toBe(100)
  })

  test('should sum values if both unsettled', () => {
    const paymentRequests = [{
      ledger: 'AP',
      value: 100
    }, {
      ledger: 'AR',
      value: -100

    }, {
      ledger: 'AP',
      value: 50
    }, {
      ledger: 'AR',
      value: -25

    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.AP).toBe(150)
    expect(unsettled.AR).toBe(125)
  })

  test('should sum values if past AP reallocation', () => {
    const paymentRequests = [{
      ledger: 'AR',
      value: -100
    }, {
      ledger: 'AR',
      value: 50
    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.AP).toBe(0)
    expect(unsettled.AR).toBe(50)
  })

  test('should sum values if past AR reallocation', () => {
    const paymentRequests = [{
      ledger: 'AP',
      value: 100
    }, {
      ledger: 'AP',
      value: -50
    }]
    const unsettled = getUnsettled(paymentRequests)
    expect(unsettled.AP).toBe(50)
    expect(unsettled.AR).toBe(0)
  })
})
