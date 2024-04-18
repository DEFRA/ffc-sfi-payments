const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

jest.mock('../../../../app/event')
const { sendHoldEvent: mockSendHoldEvent } = require('../../../../app/event')

const { REMOVED } = require('../../../../app/constants/hold-statuses')

const { sfiHoldCategory } = require('../../../mocks/holds/hold-category')
const hold = require('../../../mocks/holds/auto-hold')

const db = require('../../../../app/data')

const { removeHoldByFrn } = require('../../../../app/auto-hold/remove-hold-by-frn')

describe('remove auto hold by frn', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await db.autoHold.create(hold)
  })

  test('should update hold with closed date', async () => {
    await removeHoldByFrn(sfiHoldCategory.schemeId, hold.frn, sfiHoldCategory.name)
    const updatedHold = await db.autoHold.findOne({ where: { autoHoldId: hold.autoHoldId } })
    expect(updatedHold.closed).not.toBeNull()
  })

  test('should send hold removed event with hold data if hold exists', async () => {
    await removeHoldByFrn(sfiHoldCategory.schemeId, hold.frn, sfiHoldCategory.name)
    const updatedHold = await db.autoHold.findOne({ where: { autoHoldId: hold.autoHoldId } })
    const plainHold = updatedHold.get({ plain: true })
    expect(mockSendHoldEvent).toHaveBeenCalledWith(plainHold, REMOVED)
  })

  test('should not send hold removed event if open hold does not exist', async () => {
    await resetDatabase()
    await removeHoldByFrn(sfiHoldCategory.schemeId, hold.frn, sfiHoldCategory.name)
    expect(mockSendHoldEvent).not.toHaveBeenCalled()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
