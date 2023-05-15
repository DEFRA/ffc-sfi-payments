
const { resetDatabase, closeDatabaseConnection, saveSchedule } = require('../../../helpers')

const db = require('../../../../app/data')

const { abandonSchedule } = require('../../../../app/reschedule/abandon-schedule')
const { TIMESTAMP } = require('../../../mocks/values/date')

let scheduleId

describe('abandon schedule', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    scheduleId = await saveSchedule(undefined, true)
  })

  test('should abandon schedule by removing started date', async () => {
    await abandonSchedule(scheduleId)
    const updatedSchedules = await db.schedule.findAll({ raw: true })
    expect(updatedSchedules[0].started).toBeNull()
  })

  test('should not abandon schedule if already completed', async () => {
    await db.schedule.update({ completed: TIMESTAMP }, { where: { scheduleId } })
    await abandonSchedule(scheduleId)
    const updatedSchedules = await db.schedule.findAll({ raw: true })
    expect(updatedSchedules[0].started).toEqual(TIMESTAMP)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
