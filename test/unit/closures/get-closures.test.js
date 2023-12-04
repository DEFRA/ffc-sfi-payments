const { closureDBEntry } = require('../../mocks/closure/closure-db-entry')
const db = require('../../../app/data')
const { resetDatabase } = require('../../helpers/reset-database')
const { getClosures } = require('../../../app/closures')
const { FRN } = require('../../mocks/values/frn')
const { AGREEMENT_NUMBER } = require('../../mocks/values/agreement-number')
const { CLOSURETIMESTAMP } = require('../../mocks/values/closure-date')

describe('get closures', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
  })

  test('should get correct FRN', async () => {
    await db.frnAgreementClosed.create(closureDBEntry)
    const allClosures = await getClosures()
    expect(allClosures[0].frn).toBe(FRN.toString())
  })

  test('should get correct agreement number', async () => {
    await db.frnAgreementClosed.create(closureDBEntry)
    const allClosures = await getClosures()
    expect(allClosures[0].agreementNumber).toBe(AGREEMENT_NUMBER)
  })

  test('should get correct closure date', async () => {
    await db.frnAgreementClosed.create(closureDBEntry)
    const allClosures = await getClosures()
    expect(allClosures[0].closureDate).toEqual(CLOSURETIMESTAMP)
  })
})
