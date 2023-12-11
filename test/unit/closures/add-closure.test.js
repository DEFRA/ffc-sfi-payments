const { resetDatabase } = require('../../helpers/reset-database')
const { addClosure, getClosureCount } = require('../../../app/closures')
const { FRN } = require('../../mocks/values/frn')
const { AGREEMENT_NUMBER } = require('../../mocks/values/agreement-number')

describe('add closure', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should add a closure given correct details', async () => {
    await addClosure(FRN, AGREEMENT_NUMBER, '2023-12-09')
    const allClosures = await getClosureCount()
    expect(allClosures.length).toBe(1)
  })
})
