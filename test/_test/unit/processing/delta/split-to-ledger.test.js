const { AP, AR } = require('../../../../../app/constants/ledgers')
const { splitToLedger } = require('../../../../../app/processing/delta/assign-ledger/split-to-ledger')
const { v4: uuidv4 } = require('uuid')
const { SFI, SFI_PILOT, LUMP_SUMS, VET_VISITS, LNR } = require('../../../../../app/constants/schemes')

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

  test('should update invoice numbers for SFI', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      schemeId: SFI,
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
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'S1234567ASFI123456V02').length).toBe(1)
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'S1234567BSFI123456V02').length).toBe(1)
  })

  test('should update invoice numbers for SFI Pilot', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      schemeId: SFI_PILOT,
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
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'S1234567ASFI123456V02').length).toBe(1)
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'S1234567BSFI123456V02').length).toBe(1)
  })

  test('should update invoice numbers for Lump Sums', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      schemeId: LUMP_SUMS,
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
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'S1234567ASFI123456V02').length).toBe(1)
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'S1234567BSFI123456V02').length).toBe(1)
  })

  test('should update invoice numbers for Vet Visits', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      schemeId: VET_VISITS,
      agreementNumber: '12345678',
      invoiceNumber: 'AHWR1234567890V002',
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
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'AHWR1234567890AV02').length).toBe(1)
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'AHWR1234567890BV02').length).toBe(1)
  })

  test('should update invoice numbers for LNR', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      schemeId: LNR,
      agreementNumber: '12345678',
      invoiceNumber: 'LNR1234567890V002',
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
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'LNR1234567890AV02').length).toBe(1)
    expect(updatedPaymentRequests.filter(x => x.invoiceNumber === 'LNR1234567890BV02').length).toBe(1)
  })

  test('should create new referenceId for split request', () => {
    const paymentRequest = {
      ledger: AP,
      value: 100,
      schemeId: SFI,
      agreementNumber: '12345678',
      invoiceNumber: 'S1234567SFI123456V002',
      paymentRequestNumber: 2,
      referenceId: uuidv4(),
      invoiceLines: [{
        description: 'G00',
        value: 50
      }, {
        description: 'G00',
        value: 50
      }]
    }
    const updatedPaymentRequests = splitToLedger(paymentRequest, 10, AR)
    expect(updatedPaymentRequests.find(x => x.invoiceNumber === 'S1234567ASFI123456V02').referenceId).toBe(paymentRequest.referenceId)
    expect(updatedPaymentRequests.find(x => x.invoiceNumber === 'S1234567BSFI123456V02').referenceId).not.toBe(paymentRequest.referenceId)
    expect(updatedPaymentRequests.find(x => x.invoiceNumber === 'S1234567BSFI123456V02').referenceId).toMatch(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)
  })
})
