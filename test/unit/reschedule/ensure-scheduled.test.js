jest.mock('../../../app/reschedule/get-existing-schedule')
const { getExistingSchedule: mockGetExistingSchedule } = require('../../../app/reschedule/get-existing-schedule')

jest.mock('../../../app/inbound/create-schedule')
const { createSchedule: mockCreateSchedule } = require('../../../app/inbound/create-schedule')

jest.mock('../../../app/reschedule/abandon-schedule')
const { abandonSchedule: mockAbandonSchedule } = require('../../../app/reschedule/abandon-schedule')

const inProgress = require('../../mocks/schedules/in-progress')

const { ensureScheduled } = require('../../../app/reschedule/ensure-scheduled')

const paymentRequestId = 1
const transaction = {}

describe('ensure scheduled', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetExistingSchedule.mockResolvedValue(null)
  })

  test('should check if open schedule exists for payment request', async () => {
    await ensureScheduled(paymentRequestId, transaction)
    expect(mockGetExistingSchedule).toHaveBeenCalledWith(paymentRequestId, transaction)
  })

  test('should create schedule if none exists', async () => {
    await ensureScheduled(paymentRequestId, transaction)
    expect(mockCreateSchedule).toHaveBeenCalledWith(paymentRequestId, transaction)
  })

  test('should abandon existing schedule if open schedule exists', async () => {
    mockGetExistingSchedule.mockResolvedValue(inProgress)
    await ensureScheduled(paymentRequestId, transaction)
    expect(mockAbandonSchedule).toHaveBeenCalledWith(inProgress.scheduleId, transaction)
  })
})
