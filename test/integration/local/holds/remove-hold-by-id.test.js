const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

jest.mock('../../../../app/event')
const { sendHoldEvent: mockSendHoldEvent } = require('../../../../app/event')

const { REMOVED } = require('../../../../app/constants/hold-statuses')

const hold = require('../../../mocks/holds/hold')

const db = require('../../../../app/data')

const { removeHoldById } = require('../../../../app/holds/remove-hold-by-id')

describe('remove hold', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await db.hold.create(hold)
  })

  test('should update hold with closed date', async () => {
    await removeHoldById(hold.holdId)
    const updatedHold = await db.hold.findOne({ where: { holdId: hold.holdId } })
    expect(updatedHold.closed).not.toBeNull()
  })

  test('should send hold removed event with hold data', async () => {
    await removeHoldById(hold.holdId)
    const updatedHold = await db.hold.findOne({ where: { holdId: hold.holdId } })
    const plainHold = updatedHold.get({ plain: true })
    expect(mockSendHoldEvent).toHaveBeenCalledWith(plainHold, REMOVED)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
