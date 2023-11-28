const { closeDatabaseConnection, resetDatabase } = require('../../../helpers')
const { FRN } = require('../../../mocks/values/frn')
const { agreementNumber } = require('../../../mocks/values/agreement-number')
const { CLOSURETIMESTAMP } = require('../../../mocks/values/closure-date')
const db = require('../../../../app/data')

const { addClosure } = require('../../../../app/closures/add-closure')

describe('add closure', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should save new closure', async () => {
    await addClosure(FRN, agreementNumber, CLOSURETIMESTAMP)
    const closure = await db.frnAgreementClosed.findOne({ where: { frn: FRN } })
    expect(closure).not.toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
