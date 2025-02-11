const db = require('../../../../app/data')
const {
  completePaymentRequests
} = require('../../../../app/processing/complete-payment-requests')
const { sendZeroValueEvent } = require('../../../../app/event')

jest.mock('../../../../app/event')
const saveSchedule = async (schedule, paymentRequest) => {
  const savedSchedule = await db.schedule.create(schedule)
  return { scheduleId: savedSchedule.scheduleId }
}

describe('complete payment requests', () => {
  let paymentRequest
  let inProgressSchedule
  let completedSchedule

  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    paymentRequest = {
      invoiceNumber: 'S12345678',
      value: 100,
      invoiceLines: [{ value: 100 }]
    }

    inProgressSchedule = {
      completed: null
    }

    completedSchedule = {
      completed: new Date()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('schedule handling', () => {
    test('should not update schedule if already complete', async () => {
      const { scheduleId } = await saveSchedule(
        completedSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const schedule = await db.schedule.findByPk(scheduleId)
      expect(schedule.completed).toEqual(completedSchedule.completed)
    })

    test('should update schedule completion date', async () => {
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const schedule = await db.schedule.findByPk(scheduleId)
      expect(schedule.completed).not.toBeNull()
    })
  })

  describe('payment request processing', () => {
    test('should create completed payment request', async () => {
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const requests = await db.completedPaymentRequest.findAll()
      expect(requests.length).toBe(1)
    })

    test('should create multiple requests for split payments', async () => {
      paymentRequest.invoiceLines = [{ value: 100 }, { value: -100 }]
      paymentRequest.originalInvoiceNumber = null
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const requests = await db.completedPaymentRequest.findAll()
      expect(requests.length).toBe(2)
    })
  })

  describe('invoice line handling', () => {
    test('should create invoice lines', async () => {
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const lines = await db.completedInvoiceLine.findAll()
      expect(lines.length).toBe(paymentRequest.invoiceLines.length)
    })

    test('should not create invoice lines for zero values', async () => {
      paymentRequest.invoiceLines = [{ value: 0 }]
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const lines = await db.completedInvoiceLine.findAll()
      expect(lines.length).toBe(0)
    })
  })

  describe('outbox handling', () => {
    test('should create outbox entry for non-zero values', async () => {
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const outbox = await db.outbox.findAll()
      expect(outbox.length).toBe(1)
    })

    test('should create two outbox entry for offsetting values', async () => {
      paymentRequest.invoiceLines = [{ value: 100 }, { value: -100 }]
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )
      await completePaymentRequests(scheduleId, [paymentRequest])
      const outbox = await db.outbox.findAll()
      expect(outbox.length).toBe(2)
    })

    test('should handle pure zero value payment request', async () => {
      paymentRequest.value = 0
      paymentRequest.invoiceLines = [{ value: 0 }]
      const { scheduleId } = await saveSchedule(
        inProgressSchedule,
        paymentRequest
      )

      await completePaymentRequests(scheduleId, [paymentRequest])

      const completedRequests = await db.completedPaymentRequest.findAll()
      const outbox = await db.outbox.findAll()

      expect(completedRequests.length).toBe(1)
      expect(outbox.length).toBe(0)
      expect(sendZeroValueEvent).toHaveBeenCalledTimes(1)
    })
  })
})
