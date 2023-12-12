const { closeDatabaseConnection, resetDatabase } = require('../../../helpers')
const { FRN } = require('../../../mocks/values/frn')
const db = require('../../../../app/data')

const { removeBulkHold } = require('../../../../app/holds/remove-bulk-hold')

describe('remove bulk hold', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await db.hold.create({
      frn: FRN, holdCategoryId: 1, added: Date.now()
    })
    await db.hold.create({
      frn: 1234567891, holdCategoryId: 1, added: Date.now()
    })
  })

  test('should set hold closed if file contains one entry', async () => {
    await removeBulkHold([FRN])
    const hold = await db.hold.findOne({ where: { frn: FRN } })
    expect(hold.closed).not.toBeNull()
  })

  test('should set holds closed if file contains multiple entry', async () => {
    await removeBulkHold([FRN, 1234567891])
    const hold = await db.hold.findOne({ where: { frn: 1234567891 } })
    expect(hold.closed).not.toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
