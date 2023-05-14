const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

const paymentRequest = require('../../../mocks/payment-requests/payment-request')

const db = require('../../../../app/data')

const { createSchedule } = require('../../../../app/inbound/create-schedule')

let paymentRequestId

describe('create schedule', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await savePaymentRequest(paymentRequest)
    const savedPaymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    paymentRequestId = savedPaymentRequest.paymentRequestId
  })

  test('should save new schedule', async () => {
    await createSchedule(paymentRequestId)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId } })
    expect(schedule).not.toBeNull()
  })

  test('should save schedule with payment request id', async () => {
    await createSchedule(paymentRequestId)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId } })
    expect(schedule.paymentRequestId).toBe(paymentRequestId)
  })

  test('should save schedule as pending', async () => {
    await createSchedule(paymentRequestId)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId } })
    expect(schedule.pending).not.toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
