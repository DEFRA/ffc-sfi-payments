const db = require('../../../../app/data')
const processPaymentRequests = require('../../../../app/processing/process-payment-requests')
const moment = require('moment')
const { AP, AR } = require('../../../../app/ledgers')
let scheme
let paymentRequest
let schedule
let invoiceLine

describe('process payment requests', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    await db.schemeCode.create({
      schemeCodeId: 1,
      schemeCode: '80001'
    })

    await db.accountCode.create({
      accountCodeId: 1,
      schemeCodeId: 1,
      lineDescription: 'G00 - Gross value of claim',
      accountCodeAP: 'SOS273',
      accountCodeAR: 'SOS274'
    })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      invoiceNumber: 'S12345678SIP123456V001',
      value: 100,
      paymentRequestNumber: 1
    }

    invoiceLine = {
      invoiceLineId: 1,
      paymentRequestId: 1,
      description: 'G00 - Gross value of claim',
      schemeCode: '80001',
      fundCode: 'DRD10',
      value: 100
    }

    schedule = {
      scheduleId: 1,
      paymentRequestId: 1,
      planned: moment().subtract(1, 'day')
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should process payment request and update schedule', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const updatedSchedule = await db.schedule.findByPk(schedule.scheduleId)
    expect(updatedSchedule.completed).not.toBeNull()
  })

  test('should process payment request and created completed request', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        paymentRequestId: paymentRequest.paymentRequestId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId
      }
    })
    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should process payment request and create completed invoice lines', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        description: invoiceLine.description
      }
    })
    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should process top up request and created completed request', async () => {
    await db.scheme.create(scheme)
    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 80
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 80
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        paymentRequestId: paymentRequest.paymentRequestId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId,
        ledger: AP,
        value: 20
      }
    })

    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should process top up request and created completed lines', async () => {
    await db.scheme.create(scheme)
    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 80
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 80
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        value: 20
      }
    })

    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should process recovery request and created completed request', async () => {
    await db.scheme.create(scheme)
    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 120
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 120
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        paymentRequestId: paymentRequest.paymentRequestId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId,
        ledger: AR,
        value: -20
      }
    })

    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should process recovery request and created completed lines', async () => {
    await db.scheme.create(scheme)
    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 120
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 120
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        value: -20
      }
    })

    expect(completedInvoiceLines.length).toBe(1)
  })
})
