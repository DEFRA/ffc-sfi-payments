const { AP, AR } = require('../../../../app/ledgers')
const splitToLedger = require('../../../../app/processing/delta/split-to-ledger')

describe('split to ledger', () => {
  test('should split AP across ledgers if settlement less than current value', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: 50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = splitToLedger(paymentRequest, 10, AR)
    expect(updatedPaymentRequests.length).toBe(2)
    expect(updatedPaymentRequests.find(x => x.ledger === AP).value).toBe(90)
    expect(updatedPaymentRequests.find(x => x.ledger === AR).value).toBe(10)
  })

  test('should split AR across ledgers if settlement less than current value', () => {
    const paymentRequest = {
      ledger: AR,
      value: -100,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: -50
      }]
    }
    const updatedPaymentRequests = splitToLedger(paymentRequest, 10, AP)
    expect(updatedPaymentRequests.length).toBe(2)
    expect(updatedPaymentRequests.find(x => x.ledger === AP).value).toBe(-10)
    expect(updatedPaymentRequests.find(x => x.ledger === AR).value).toBe(-90)
  })

  test('should update invoice numbers', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: 50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = splitToLedger(paymentRequest, 10, AR)
    expect(updatedPaymentRequests.length).toBe(2)
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber.startsWith('S1234567A')).length).toBe(1)
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber.startsWith('S1234567B')).length).toBe(1)
  })
})
