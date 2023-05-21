const { AP, AR } = require('../../../../app/constants/ledgers')
const { getOutstandingLedgerValues } = require('../../../../app/processing/delta/get-outstanding-ledger-values')

describe('get outstanding ledger values', () => {
  test('should return zero for both ledger if no outstanding values', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 100
    }, {
      ledger: AR,
      value: -100
    }, {
      ledger: AR,
      value: 100
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(0)
    expect(outstandingLedgerValues.AR).toBe(0)
  })

  test('should return hasOutstanding false if no outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 100
    }, {
      ledger: AR,
      value: -100
    }, {
      ledger: AR,
      value: 100
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.hasOutstanding).toBe(false)
  })

  test('should return AP value if AP outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 0
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(100)
    expect(outstandingLedgerValues.AR).toBe(0)
  })

  test('should return AR value if AR outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 100
    }, {
      ledger: AR,
      value: -100

    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(0)
    expect(outstandingLedgerValues.AR).toBe(100)
  })

  test('should return values if both outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 0
    }, {
      ledger: AR,
      value: -100
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(100)
    expect(outstandingLedgerValues.AR).toBe(100)
  })

  test('should sum values if both outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 0
    }, {
      ledger: AR,
      value: -100
    }, {
      ledger: AP,
      value: 50,
      settledValue: 0
    }, {
      ledger: AR,
      value: -25
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(150)
    expect(outstandingLedgerValues.AR).toBe(125)
  })

  test('should sum values if past AP reallocation', () => {
    const paymentRequests = [{
      ledger: AR,
      value: -100
    }, {
      ledger: AR,
      value: 50
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(0)
    expect(outstandingLedgerValues.AR).toBe(50)
  })

  test('should sum values if past AR reallocation', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 0
    }, {
      ledger: AP,
      value: -50,
      settledValue: 0
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(50)
    expect(outstandingLedgerValues.AR).toBe(0)
  })

  test('should return AP value if AP partially outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 50
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(50)
    expect(outstandingLedgerValues.AR).toBe(0)
  })

  test('should return AR value if AR partially outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 100
    }, {
      ledger: AR,
      value: -100
    }, {
      ledger: AR,
      value: 50
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(0)
    expect(outstandingLedgerValues.AR).toBe(50)
  })

  test('should return values if both partially outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 50
    }, {
      ledger: AR,
      value: -100
    }, {
      ledger: AR,
      value: 50
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(50)
    expect(outstandingLedgerValues.AR).toBe(50)
  })

  test('should sum values if both partially outstanding', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 25
    }, {
      ledger: AR,
      value: -100
    }, {
      ledger: AP,
      value: 50,
      settledValue: 25
    }, {
      ledger: AR,
      value: -25
    }, {
      ledger: AR,
      value: 50
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(100)
    expect(outstandingLedgerValues.AR).toBe(75)
  })

  test('should sum values if past AR reallocation and partially settled', () => {
    const paymentRequests = [{
      ledger: AP,
      value: 100,
      settledValue: 50
    }, {
      ledger: AP,
      value: -50,
      settledValue: 0
    }]
    const outstandingLedgerValues = getOutstandingLedgerValues(paymentRequests)
    expect(outstandingLedgerValues.AP).toBe(0)
    expect(outstandingLedgerValues.AR).toBe(0)
  })
})
