const { resetDatabase, closeDatabaseConnection, saveSchedule } = require('../../../helpers')

const newSchedule = require('../../../mocks/schedules/new')
const inProgressSchedule = require('../../../mocks/schedules/in-progress')
const completedSchedule = require('../../../mocks/schedules/completed')

const { getExistingSchedule } = require('../../../../app/reschedule/get-existing-schedule')

describe('get existing schedule', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should get existing in progress payment schedule if matched by payment request', async () => {
    const { paymentRequestId } = await saveSchedule(inProgressSchedule)
    const existingSchedule = await getExistingSchedule(paymentRequestId)
    expect(existingSchedule).toMatchObject(inProgressSchedule)
  })

  test('should get existing new payment schedule if matched by payment request', async () => {
    const { paymentRequestId } = await saveSchedule(newSchedule)
    const existingSchedule = await getExistingSchedule(paymentRequestId)
    expect(existingSchedule).toMatchObject(newSchedule)
  })

  test('should not get existing completed payment schedule if matched by payment request', async () => {
    const { paymentRequestId } = await saveSchedule(completedSchedule)
    const existingSchedule = await getExistingSchedule(paymentRequestId)
    expect(existingSchedule).toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
