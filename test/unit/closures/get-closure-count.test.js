const { closureDBEntry } = require('../../mocks/closure/closure-db-entry')
const db = require('../../../app/data')
const { resetDatabase } = require('../../helpers/reset-database')
const { getClosureCount } = require('../../../app/closures')

describe('get closure count', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should get correct length', async () => {
    await db.frnAgreementClosed.create(closureDBEntry)
    const allClosures = await getClosureCount()
    expect(allClosures.length).toBe(1)
  })
})
