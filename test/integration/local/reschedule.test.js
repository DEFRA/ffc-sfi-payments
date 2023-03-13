jest.mock('ffc-messaging')
const db = require('../../../app/data')
const holdAndReschedule = require('../../../app/reschedule')

describe('reschedule processing', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    await db.scheme.create({
      schemeId: 1,
      name: 'SFI',
      active: true
    })

    await db.paymentRequest.create({
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      invoiceNumber: 'S12345678A123456V001'
    })

    await db.schedule.create({
      scheduleId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      started: new Date()
    })

    await db.holdCategory.create({
      holdCategoryId: 1,
      schemeId: 1,
      name: 'my hold'
    })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should apply hold for FRN and category', async () => {
    await holdAndReschedule(1, 1, 1, 1234567890)
    const holds = await db.hold.findAll({ where: { frn: 1234567890, holdCategoryId: 1 } })
    expect(holds).toHaveLength(1)
  })

  test('should abandon schedule', async () => {
    await holdAndReschedule(1, 1, 1, 1234567890)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId: 1 } })
    expect(schedule.started).toBeNull()
  })

  test('should create new schedule if does not exist', async () => {
    await db.schedule.destroy({ where: { scheduleId: 1 } })
    await holdAndReschedule(1, 1, 1, 1234567890)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId: 1 } })
    expect(schedule).toBeDefined()
  })

  test('should not abandon completed schedule', async () => {
    await db.schedule.update({ completed: new Date() }, { where: { scheduleId: 1 } })
    await holdAndReschedule(1, 1, 1, 1234567890)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId: 1 } })
    expect(schedule.started).not.toBeNull()
  })
})
