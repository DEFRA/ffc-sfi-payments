const { FDMR, BPS, SFI } = require('../../../app/constants/schemes')
const { DOM00, DOM01, DOM10 } = require('../../../app/constants/domestic-fund-codes')

const applyDualAccounting = require('../../../app/processing/apply-dual-accounting')

let paymentRequests
let previousPaymentRequests

describe('apply dual accounting', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequests = [{
      sourceSystem: 'FDMR',
      deliveryBody: 'RP00',
      invoiceNumber: 'F0000002C0000002V001',
      frn: 1000000002,
      marketingYear: 2020,
      paymentRequestNumber: 1,
      contractNumber: 'C0000002',
      currency: 'GBP',
      dueDate: '01/12/2020',
      value: 25000,
      invoiceLines: [{
        invoiceNumber: 1,
        schemeCode: '10570',
        fundCode: 'EGF00',
        description: 'G01 - Gross value of claim',
        value: 25000,
        deliveryBody: 'RP00',
        convergence: false
      }],
      schemeId: FDMR,
      agreementNumber: 'C0000002',
      ledger: 'AP'
    }]

    previousPaymentRequests = [{
      sourceSystem: 'FDMR',
      deliveryBody: 'RP00',
      invoiceNumber: 'F0000001C0000001V001',
      frn: 1000000001,
      marketingYear: 2020,
      paymentRequestNumber: 1,
      contractNumber: 'C0000001',
      currency: 'GBP',
      dueDate: '01/12/2020',
      value: 25000,
      invoiceLines: [{
        invoiceNumber: 1,
        schemeCode: '10570',
        fundCode: 'DOM00',
        description: 'G01 - Gross value of claim',
        value: 25000,
        deliveryBody: 'RP00',
        convergence: false
      }],
      schemeId: FDMR,
      agreementNumber: 'C0000001',
      ledger: 'AP'
    }]
  })

  test('should switch fund code to DOM10 if FDMR and marketing year is greater than or equal to 2020', async () => {
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(DOM10)
  })

  test('should switch fund code of each invoice line to DOM10 if FDMR and marketing year is greater than or equal to 2020', async () => {
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(DOM10)
    }
  })

  test('should switch fund code to previous payment requests domestic fund code if FDMR, marketing year is less than 2020 and not first payment', async () => {
    paymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].marketingYear = 2019
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(previousPaymentRequests[previousPaymentRequests.length - 1].invoiceLines[0].fundCode)
  })

  test('should switch fund code of each invoice line to previous payment requests domestic fund code if FDMR, marketing year is less than 2020 and not first payment', async () => {
    paymentRequests[0].marketingYear = 2019
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    previousPaymentRequests[0].marketingYear = 2019
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(previousPaymentRequests[previousPaymentRequests.length - 1].invoiceLines[0].fundCode)
    }
  })

  test('should switch fund code to DOM01 if FDMR, marketing year is less than 2020 and has previous payment requests with no domestic fund code set', async () => {
    paymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].invoiceLines[0].fundCode = 'EGF00'
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(DOM01)
  })

  test('should switch fund code to DOM01 for each invoice line if FDMR, marketing year is less than 2020 and has previous payment requests with no domestic fund code set', async () => {
    paymentRequests[0].marketingYear = 2019
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    previousPaymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].invoiceLines[0].fundCode = 'EGF00'
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(DOM01)
    }
  })

  test('should switch fund code to DOM00 if FDMR, marketing year is less than 2020 and first payment', async () => {
    paymentRequests[0].marketingYear = 2019
    previousPaymentRequests = []
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(DOM00)
  })

  test('should switch fund code to DOM00 for each invoice line if FDMR, marketing year is less than 2020 and first payment', async () => {
    paymentRequests[0].marketingYear = 2019
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    previousPaymentRequests = []
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(DOM00)
    }
  })

  test('should switch fund code to DOM10 if BPS and marketing year is greater than or equal to 2020', async () => {
    paymentRequests[0].schemeId = BPS
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(DOM10)
  })

  test('should switch fund code of each invoice line to DOM10 if BPS and marketing year is greater than or equal to 2020', async () => {
    paymentRequests[0].schemeId = BPS
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(DOM10)
    }
  })

  test('should switch fund code to previous payment requests domestic fund code if BPS, marketing year is less than 2020 and not first payment', async () => {
    paymentRequests[0].schemeId = BPS
    paymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].marketingYear = 2019
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(previousPaymentRequests[previousPaymentRequests.length - 1].invoiceLines[0].fundCode)
  })

  test('should switch fund code of each invoice line to previous payment requests domestic fund code if BPS, marketing year is less than 2020 and not first payment', async () => {
    paymentRequests[0].schemeId = BPS
    paymentRequests[0].marketingYear = 2019
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    previousPaymentRequests[0].marketingYear = 2019
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(previousPaymentRequests[previousPaymentRequests.length - 1].invoiceLines[0].fundCode)
    }
  })

  test('should switch fund code to DOM01 if BPS, marketing year is less than 2020 and has previous payment requests with no domestic fund code set', async () => {
    paymentRequests[0].schemeId = BPS
    paymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].invoiceLines[0].fundCode = 'EGF00'
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(DOM01)
  })

  test('should switch fund code to DOM01 for each invoice line if BPS, marketing year is less than 2020 and has previous payment requests with no domestic fund code set', async () => {
    paymentRequests[0].schemeId = BPS
    paymentRequests[0].marketingYear = 2019
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    previousPaymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].invoiceLines[0].fundCode = 'EGF00'
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(DOM01)
    }
  })

  test('should switch fund code to DOM00 if BPS, marketing year is less than 2020 and first payment', async () => {
    paymentRequests[0].schemeId = BPS
    paymentRequests[0].marketingYear = 2019
    previousPaymentRequests = []
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe(DOM00)
  })

  test('should switch fund code to DOM00 for each invoice line if BPS, marketing year is less than 2020 and first payment', async () => {
    paymentRequests[0].schemeId = BPS
    paymentRequests[0].marketingYear = 2019
    paymentRequests[0].invoiceLines[1] = {
      invoiceNumber: 2,
      schemeCode: '10570',
      fundCode: 'EGF00',
      description: 'G01 - Gross value of claim',
      value: 0,
      deliveryBody: 'RP00',
      convergence: false
    }
    previousPaymentRequests = []
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    for (const line of paymentRequests[0].invoiceLines) {
      expect(line.fundCode).toBe(DOM00)
    }
  })

  test('should iterate over any previous payment requests with no invoice lines', async () => {
    paymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].marketingYear = 2019
    previousPaymentRequests[0].invoiceLines = []
    previousPaymentRequests[1] = {
      invoiceLines: [{
        invoiceNumber: 1,
        schemeCode: '10570',
        fundCode: 'DOM00',
        description: 'G01 - Gross value of claim',
        value: 25000,
        deliveryBody: 'RP00',
        convergence: false
      }]
    }
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe('DOM00')
  })

  test('should not switch fund code if SFI', async () => {
    paymentRequests[0].schemeId = SFI
    await applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceLines[0].fundCode).toBe('EGF00')
  })
})
