const { AP, AR } = require('../../../../app/ledgers')
const allocateToLedgers = require('../../../../app/processing/delta/allocate-to-ledgers')

describe('allocate to ledgers', () => {
  test('should reallocate all AP to AR if unsettled value is greater than current request value', () => {
    const paymentRequest = {
      ledger: AP,
      value: 10
    }
    const unsettled = {
      AR: 100,
      AP: 0
    }
    const updatedPaymentRequests = allocateToLedgers(paymentRequest, unsettled)
    expect(updatedPaymentRequests[0].ledger).toBe(AR)
  })

  test('should reallocate all AR to AP if unsettled value is greater than current request recovery', () => {
    const paymentRequest = {
      ledger: AR,
      value: -10
    }
    const unsettled = {
      AR: 0,
      AP: 100
    }
    const updatedPaymentRequests = allocateToLedgers(paymentRequest, unsettled)
    expect(updatedPaymentRequests[0].ledger).toBe(AP)
  })

  test('should split AP across ledgers if settlement less than current value', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: 50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const unsettled = {
      AR: 10,
      AP: 0
    }
    const updatedPaymentRequests = allocateToLedgers(paymentRequest, unsettled)
    expect(updatedPaymentRequests.length).toBe(2)
    expect(updatedPaymentRequests.find(x => x.ledger === AP).value).toBe(90)
    expect(updatedPaymentRequests.find(x => x.ledger === AR).value).toBe(10)
  })

  test('should split AR across ledgers if settlement less than current value', () => {
    const paymentRequest = {
      ledger: AR,
      value: -100,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: -50
      }]
    }
    const unsettled = {
      AR: 0,
      AP: 10
    }
    const updatedPaymentRequests = allocateToLedgers(paymentRequest, unsettled)
    expect(updatedPaymentRequests.length).toBe(2)
    expect(updatedPaymentRequests.find(x => x.ledger === AP).value).toBe(-10)
    expect(updatedPaymentRequests.find(x => x.ledger === AR).value).toBe(-90)
  })

  test('should split AP across ledgers if settlement less than current value when single invoice line', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: 100
      }]
    }
    const unsettled = {
      AR: 10,
      AP: 0
    }
    const updatedPaymentRequests = allocateToLedgers(paymentRequest, unsettled)
    expect(updatedPaymentRequests.length).toBe(2)
    expect(updatedPaymentRequests.find(x => x.ledger === AP).value).toBe(90)
    expect(updatedPaymentRequests.find(x => x.ledger === AR).value).toBe(10)
  })
})
