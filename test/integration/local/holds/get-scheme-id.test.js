const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const { sfiHoldCategory } = require('../../../mocks/holds/hold-category')

const { getSchemeId } = require('../../../../app/holds/get-scheme-id')

describe('get scheme id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should return scheme id if hold category id exists', async () => {
    const schemeId = await getSchemeId(sfiHoldCategory.holdCategoryId)
    expect(schemeId).toBe(sfiHoldCategory.schemeId)
  })

  test('should return undefined if hold category does not exist', async () => {
    const schemeId = await getSchemeId(999)
    expect(schemeId).toBeUndefined()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
