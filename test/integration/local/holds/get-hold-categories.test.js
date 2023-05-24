const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const { sfiHoldCategory } = require('../../../mocks/holds/hold-category')
const scheme = require('../../../mocks/schemes/scheme')

const { getHoldCategories } = require('../../../../app/holds/get-hold-categories')

describe('get hold categories', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should return all hold categories', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories.length).toBe(4)
  })

  test('should return hold categories with hold category id', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].holdCategoryId).toBeDefined()
  })

  test('should return hold categories with name', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].name).toBeDefined()
  })

  test('should return hold categories with scheme id', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].schemeId).toBeDefined()
  })

  test('should return hold categories with scheme name', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].schemeName).toBeDefined()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
