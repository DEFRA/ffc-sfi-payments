const { AP, AR } = require('../../../../app/ledgers')
const zeroValueSplit = require('../../../../app/processing/delta/zero-value-split')

describe('zero value split', () => {
  test('should create two AP requests', () => {
    const paymentRequest = {
      ledger: AP,
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = zeroValueSplit(paymentRequest)
    expect(updatedPaymentRequests.length).toBe(2)
    expect(updatedPaymentRequests.filter(x => x.ledger === AP).length).toBe(2)
    expect(updatedPaymentRequests.filter(x => x.ledger === AR).length).toBe(0)
  })

  test('should move all positive lines to AP', () => {
    const paymentRequest = {
      ledger: AP,
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = zeroValueSplit(paymentRequest)
    expect(updatedPaymentRequests.filter(x => x.ledger === AP && x.invoiceLines[0].value === 50).length).toBe(1)
  })

  test('should move all negative lines to AP', () => {
    const paymentRequest = {
      ledger: AP,
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = zeroValueSplit(paymentRequest)
    expect(updatedPaymentRequests.find(x => x.ledger === AP && x.invoiceLines[0].value === -50)).toBeDefined()
  })

  test('should calculate positive AP value', () => {
    const paymentRequest = {
      ledger: AP,
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = zeroValueSplit(paymentRequest)
    expect(updatedPaymentRequests.find(x => x.ledger === AP && x.value === 50)).toBeDefined()
  })

  test('should calculate negative AP value', () => {
    const paymentRequest = {
      ledger: AP,
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = zeroValueSplit(paymentRequest)
    expect(updatedPaymentRequests.find(x => x.ledger === AP && x.value === -50)).toBeDefined()
  })

  test('should update original invoice number', () => {
    const paymentRequest = {
      ledger: AP,
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = zeroValueSplit(paymentRequest)
    expect(updatedPaymentRequests.find(x => x.originalInvoiceNumber === 'S1234567SFI123456V002')).toBeDefined()
    expect(updatedPaymentRequests.find(x => x.originalInvoiceNumber === 'S1234567SFI123456V002')).toBeDefined()
  })

  test('should update invoice number', () => {
    const paymentRequest = {
      ledger: AP,
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      invoiceLines: [{
        description: 'G00',
        value: -50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = zeroValueSplit(paymentRequest)
    expect(updatedPaymentRequests.find(x => x.invoiceNumber === 'S1234567ASFI123456V02')).toBeDefined()
    expect(updatedPaymentRequests.find(x => x.invoiceNumber === 'S1234567BSFI123456V02')).toBeDefined()
  })
})
