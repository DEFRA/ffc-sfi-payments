const { resetDatabase, closeDatabaseConnection, saveSchedule } = require('../../../helpers')

const inProgressSchedule = require('../../../mocks/schedules/in-progress')
const completedSchedule = require('../../../mocks/schedules/completed')

const db = require('../../../../app/data')

const { completePaymentRequests } = require('../../../../app/processing/complete-payment-requests')

let paymentRequest

describe('complete payment requests', () => {
  beforeEach(async () => {
    await resetDatabase()
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })

  test('should update schedule as complete', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const updatedSchedule = await db.schedule.findByPk(scheduleId)
    expect(updatedSchedule.completed).not.toBeNull()
  })

  test('should create completed payment request', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const completedPaymentRequests = await db.completedPaymentRequest.findAll()
    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should create completed invoice line', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(paymentRequest.invoiceLines.length)
  })

  test('should create completed payment request with values', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId
      }
    })
    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should create completed invoice line with values', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        description: paymentRequest.invoiceLines[0].description
      }
    })
    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should create multiple payment requests', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest, paymentRequest])
    const completedPaymentRequests = await db.completedPaymentRequest.findAll()
    expect(completedPaymentRequests.length).toBe(2)
  })

  test('should create multiple invoice lines for multiple requests', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest, paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(paymentRequest.invoiceLines.length * 2)
  })

  test('should not create completed payment request if already complete', async () => {
    const { scheduleId } = await saveSchedule(completedSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const completedPaymentRequests = await db.completedPaymentRequest.findAll()
    expect(completedPaymentRequests.length).toBe(0)
  })

  test('should not create completed invoice lines if already complete', async () => {
    const { scheduleId } = await saveSchedule(completedSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(0)
  })

  test('should not update schedule if already complete', async () => {
    const { scheduleId } = await saveSchedule(completedSchedule, paymentRequest)
    await completePaymentRequests(scheduleId, [paymentRequest])
    const updatedSchedule = await db.schedule.findByPk(scheduleId)
    expect(updatedSchedule.completed).toStrictEqual(completedSchedule.completed)
  })
})
