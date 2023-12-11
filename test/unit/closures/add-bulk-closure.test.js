const { resetDatabase } = require('../../helpers/reset-database')
const { addBulkClosure, getClosureCount } = require('../../../app/closures')
const { FRN } = require('../../mocks/values/frn')
const { AGREEMENT_NUMBER } = require('../../mocks/values/agreement-number')

describe('add closure', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should add a bulk closure given correct details, data length 1', async () => {
    await addBulkClosure([{ frn: FRN, agreementNumber: AGREEMENT_NUMBER, closureDate: '2023-12-09' }])
    const allClosures = await getClosureCount()
    expect(allClosures.length).toBe(1)
  })

  test('should add a bulk closure given correct details, data length > 1', async () => {
    await addBulkClosure([{ frn: FRN, agreementNumber: AGREEMENT_NUMBER, closureDate: '2023-12-09' }, { frn: FRN + 1, agreementNumber: 'agreement', closureDate: '2024-02-26' }])
    const allClosures = await getClosureCount()
    expect(allClosures.length).toBe(2)
  })
})
