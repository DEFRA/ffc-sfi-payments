const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const holdCategory = require('../../../mocks/holds/hold-category')

const { getHoldCategoryId } = require('../../../../app/holds/get-hold-category-id')

describe('get hold category id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should return hold category id if scheme and name exists', async () => {
    const holdCategoryId = await getHoldCategoryId(holdCategory.schemeId, holdCategory.name)
    expect(holdCategoryId).toBe(holdCategory.holdCategoryId)
  })

  test('should return undefined if scheme does not exist', async () => {
    const holdCategoryId = await getHoldCategoryId(999, holdCategory.name)
    expect(holdCategoryId).toBeUndefined()
  })

  test('should return undefined if name does not exist', async () => {
    const holdCategoryId = await getHoldCategoryId(holdCategory.schemeId, 'unknown')
    expect(holdCategoryId).toBeUndefined()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
