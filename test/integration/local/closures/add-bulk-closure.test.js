const { closeDatabaseConnection, resetDatabase } = require('../../../helpers')
const { FRN } = require('../../../mocks/values/frn')
const { agreementNumber } = require('../../../mocks/values/agreement-number')
const { CLOSURETIMESTAMP } = require('../../../mocks/values/closure-date')
const db = require('../../../../app/data')

const { addBulkClosure } = require('../../../../app/closures/add-bulk-closure')

describe('add bulk closure', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should save new closure if file contains one entry', async () => {
    await addBulkClosure([{ frn: FRN, agreementNumber, closureDate: CLOSURETIMESTAMP }])
    const closure = await db.frnAgreementClosed.findOne({ where: { frn: FRN } })
    expect(closure).not.toBeNull()
  })

  test('should save new closures if file contains multiple entry', async () => {
    await addBulkClosure([{ frn: FRN, agreementNumber, closureDate: CLOSURETIMESTAMP }, { frn: 1234567891, agreementNumber, closureDate: CLOSURETIMESTAMP }])
    const closures = await db.frnAgreementClosed.findAll()
    expect(closures.length).toBe(2)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
