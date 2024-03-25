const db = require('../../../app/data')
const { hasAutoHold } = require('../../../app/auto-hold/has-auto-hold')

const { closeDatabaseConnection } = require('../../helpers')
const { FRN } = require('../../mocks/values/frn')
const { MARKETING_YEAR } = require('../../mocks/values/marketing-year')

const paymentRequest = {
  schemeId: 1,
  frn: FRN,
  marketingYear: MARKETING_YEAR
}

const autoHold = {
  autoHoldCategoryId: 1,
  schemeId: 1,
  frn: FRN,
  marketingYear: MARKETING_YEAR
}

describe('hasAutoHold function', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.autoHold.create(autoHold)
  })

  test('should return true if auto hold exists for payment request', async () => {
    const result = await hasAutoHold(paymentRequest)
    expect(result).toBe(true)
  })

  test('should return false if no auto hold exists for payment request', async () => {
    paymentRequest.schemeId = 2
    const result = await hasAutoHold(paymentRequest)
    expect(result).toBe(false)
  })
})

afterAll(async () => {
  await closeDatabaseConnection()
})
