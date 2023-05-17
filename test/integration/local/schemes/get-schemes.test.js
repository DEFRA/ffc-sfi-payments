const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const db = require('../../../../app/data')

const { getSchemes } = require('../../../../app/schemes/get-schemes')

describe('get schemes', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should return all schemes that exist', async () => {
    const schemes = await getSchemes()
    expect(schemes.length).toBe(8)
  })

  test('should return empty array if no schemes exist', async () => {
    await db.scheme.destroy({ where: {})
    const schemes = await getSchemes()
    expect(schemes.length).toBe(0)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
