const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const closure = require('../../../mocks/closure/closure-db-entry')

const db = require('../../../../app/data')

const { getClosureCount } = require('../../../../app/closures/get-closure-count')

describe('get closures', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await db.frnAgreementClosed.create(closure)
    await db.frnAgreementClosed.create({ ...closure, frn: 1234567891 })
  })

  test('should return all closures', async () => {
    const closuresResult = await getClosureCount()
    expect(closuresResult.length).toBe(2)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
