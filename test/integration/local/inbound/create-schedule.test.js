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

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
