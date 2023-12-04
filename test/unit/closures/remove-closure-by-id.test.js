const { closureDBEntry } = require('../../mocks/closure/closure-db-entry')
const db = require('../../../app/data')
const { resetDatabase } = require('../../helpers/reset-database')
const { removeClosureById, getClosureCount } = require('../../../app/closures')

describe('remove closure', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should remove relevant closure', async () => {
    await db.frnAgreementClosed.create(closureDBEntry)
    await removeClosureById(1)
    const closures = await getClosureCount()
    expect(closures.length).toBe(0)
  })
})
