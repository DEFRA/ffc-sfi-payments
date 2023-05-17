const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

jest.mock('../../../../app/event')
const { sendHoldEvent: mockSendHoldEvent } = require('../../../../app/event')

const { REMOVED } = require('../../../../app/constants/hold-statuses')

const holdCategory = require('../../../mocks/holds/hold-category')
const hold = require('../../../mocks/holds/hold')

const db = require('../../../../app/data')

const { removeHoldByFrn } = require('../../../../app/holds/remove-hold-by-frn')

describe('remove hold by frn', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await db.hold.create(hold)
  })

  test('should update hold with closed date', async () => {
    await removeHoldByFrn(holdCategory.schemeId, hold.frn, holdCategory.name)
    const updatedHold = await db.hold.findOne({ where: { holdId: hold.holdId } })
    expect(updatedHold.closed).not.toBeNull()
  })

  test('should send hold removed event with hold data if hold exists', async () => {
    await removeHoldByFrn(holdCategory.schemeId, hold.frn, holdCategory.name)
    const updatedHold = await db.hold.findOne({ where: { holdId: hold.holdId } })
    const plainHold = updatedHold.get({ plain: true })
    expect(mockSendHoldEvent).toHaveBeenCalledWith(plainHold, REMOVED)
  })

  test('should not send hold removed event if open hold does not exist', async () => {
    await resetDatabase()
    await removeHoldByFrn(holdCategory.schemeId, hold.frn, holdCategory.name)
    expect(mockSendHoldEvent).not.toHaveBeenCalled()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
