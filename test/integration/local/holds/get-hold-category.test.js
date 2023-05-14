const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const holdCategory = require('../../../mocks/holds/hold-category')
const scheme = require('../../../mocks/scheme')

const { getHoldCategory } = require('../../../../app/holds/get-hold-category')

describe('get hold categories', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should return hold category if hold category id exists', async () => {
    const holdCategoryResult = await getHoldCategory(holdCategory.holdCategoryId)
    expect(holdCategoryResult).toMatchObject(holdCategory)
  })

  test('should return hold category with scheme if hold category id exists', async () => {
    const holdCategoryResult = await getHoldCategory(holdCategory.holdCategoryId)
    expect(holdCategoryResult.scheme).toMatchObject(scheme)
  })

  test('should return null if hold category id does not exist', async () => {
    const holdCategoryResult = await getHoldCategory(999)
    expect(holdCategoryResult).toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
