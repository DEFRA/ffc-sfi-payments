const { resetDatabase, closeDatabaseConnection } = require('../../../helpers')

const { sfiHoldCategory, sfiPilotAutoHoldCategory } = require('../../../mocks/holds/hold-category')

const { getSchemeId } = require('../../../../app/holds/get-scheme-id')

describe('get scheme id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should return scheme id if hold category id exists', async () => {
    const schemeId = await getSchemeId(sfiHoldCategory.holdCategoryId, null)
    expect(schemeId).toBe(sfiHoldCategory.schemeId)
  })

  test('should return undefined if hold category does not exist', async () => {
    const schemeId = await getSchemeId(999, null)
    expect(schemeId).toBeUndefined()
  })

  test('should return scheme id if auto hold category id exists', async () => {
    const schemeId = await getSchemeId(null, sfiPilotAutoHoldCategory.autoHoldCategoryId)
    expect(schemeId).toBe(sfiPilotAutoHoldCategory.schemeId)
  })

  test('should return undefined if auto hold category does not exist', async () => {
    const schemeId = await getSchemeId(null, 999)
    expect(schemeId).toBeUndefined()
  })

  test('should use hold category id if hold and auto hold category present for any reason', async () => {
    const schemeId = await getSchemeId(sfiHoldCategory.holdCategoryId, sfiPilotAutoHoldCategory.autoHoldCategoryId)
    expect(schemeId).toBe(sfiHoldCategory.schemeId)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
