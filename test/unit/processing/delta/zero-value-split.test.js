const zeroValueSplit = require('../../../../app/processing/delta/zero-value-split')

describe('zero value split', () => {
  test('should create AP and AR request', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
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
    expect(updatedPaymentRequests.filter(x => x.ledger === 'AP').length).toBe(1)
    expect(updatedPaymentRequests.filter(x => x.ledger === 'AR').length).toBe(1)
  })

  test('should move all positive lines to AP', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
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
    expect(updatedPaymentRequests.find(x => x.ledger === 'AP').invoiceLines.length).toBe(1)
    expect(updatedPaymentRequests.find(x => x.ledger === 'AP').invoiceLines[0].value).toBe(50)
  })

  test('should move all negative lines to AR', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
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
    expect(updatedPaymentRequests.find(x => x.ledger === 'AR').invoiceLines.length).toBe(1)
    expect(updatedPaymentRequests.find(x => x.ledger === 'AR').invoiceLines[0].value).toBe(-50)
  })

  test('should calculate AP value', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
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
    expect(updatedPaymentRequests.find(x => x.ledger === 'AP').value).toBe(50)
  })

  test('should calculate AR value', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
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
    expect(updatedPaymentRequests.find(x => x.ledger === 'AR').value).toBe(-50)
  })

  test('should update original invoice number', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
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
    expect(updatedPaymentRequests.find(x => x.ledger === 'AP').originalInvoiceNumber).toBe('S12345678SFI123456V002')
    expect(updatedPaymentRequests.find(x => x.ledger === 'AR').originalInvoiceNumber).toBe('S12345678SFI123456V002')
  })

  test('should update invoice number', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 0,
      agreementNumber: '12345678',
      invoiceNumber: 'S12345678SFI123456V002',
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
    expect(updatedPaymentRequests.find(x => x.ledger === 'AP').invoiceNumber).toBe('S12345678ASFI123456V02')
    expect(updatedPaymentRequests.find(x => x.ledger === 'AR').invoiceNumber).toBe('S12345678BSFI123456V02')
  })
})
