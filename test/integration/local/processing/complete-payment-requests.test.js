const db = require('../../../../app/data')
const completePaymentRequest = require('../../../../app/processing/complete-payment-requests')
const moment = require('moment')
let scheme
let paymentRequest
let schedule
let invoiceLine

describe('complete payment requests', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022
    }

    invoiceLine = {
      invoiceLineId: 1,
      paymentRequestId: 1,
      description: 'G00'
    }

    schedule = {
      scheduleId: 1,
      paymentRequestId: 1,
      planned: new Date()
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should update schedule as complete', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const updatedSchedule = await db.schedule.findByPk(schedule.scheduleId)
    expect(updatedSchedule.completed).not.toBeNull()
  })

  test('should create completed payment request', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const completedPaymentRequests = await db.completedPaymentRequest.findAll()
    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should create completed invoice line', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should create completed payment request with values', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
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

  test('should create completed invoice line with values', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        description: invoiceLine.description
      }
    })
    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should create multiple payment requests', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    const paymentRequest2 = paymentRequest
    paymentRequest2.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest, paymentRequest2])
    const completedPaymentRequests = await db.completedPaymentRequest.findAll()
    expect(completedPaymentRequests.length).toBe(2)
  })

  test('should create multiple invoice lines for multiple requests', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    const paymentRequest2 = paymentRequest
    paymentRequest2.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest, paymentRequest2])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(2)
  })

  test('should create multiple invoice lines for same request', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    const invoiceLine2 = invoiceLine
    paymentRequest.invoiceLines = [invoiceLine, invoiceLine2]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(2)
  })

  test('should not create completed payment request if already complete', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    schedule.completed = new Date()
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const completedPaymentRequests = await db.completedPaymentRequest.findAll()
    expect(completedPaymentRequests.length).toBe(0)
  })

  test('should not create completed invoice lines if already complete', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    schedule.completed = new Date()
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(0)
  })

  test('should not update schedule if already complete', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    const completedDate = moment().subtract(1, 'day')
    schedule.completed = completedDate
    await db.schedule.create(schedule)
    paymentRequest.invoiceLines = [invoiceLine]
    await completePaymentRequest(schedule.scheduleId, [paymentRequest])
    const updatedSchedule = await db.schedule.findByPk(schedule.scheduleId)
    expect(updatedSchedule.completed).toStrictEqual(completedDate.toDate())
  })
})
