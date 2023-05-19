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
    expect(holdCategories.length).toBe(2)
  })

  test('should return hold categories with hold category id', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].holdCategoryId).toBe(1)
  })

  test('should return hold categories with name', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].name).toBe(sfiHoldCategory.name)
  })

  test('should return hold categories with scheme id', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].schemeId).toBe(sfiHoldCategory.schemeId)
  })

  test('should return hold categories with scheme name', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].schemeName).toBe(scheme.name)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
