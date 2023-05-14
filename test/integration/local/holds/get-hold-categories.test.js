const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const holdCategory = require('../../../mocks/holds/hold-category')
const scheme = require('../../../mocks/scheme')

const db = require('../../../../app/data')

const { getHoldCategories } = require('../../../../app/holds/get-hold-categories')

describe('get hold categories', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await db.holdCategory.create({ ...holdCategory, holdCategoryId: 2 })
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
    expect(holdCategories[0].name).toBe(holdCategory.name)
  })

  test('should return hold categories with scheme id', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].schemeId).toBe(holdCategory.schemeId)
  })

  test('should return hold categories with scheme name', async () => {
    const holdCategories = await getHoldCategories()
    expect(holdCategories[0].schemeName).toBe(scheme.name)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
