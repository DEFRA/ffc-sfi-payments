const db = require('../../../../app/data')
const getPreviousPaymentRequests = require('../../../../app/processing/get-previous-payment-requests')
let scheme
let paymentRequest
let completedPaymentRequest

describe('get payment requests', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022
    }

    completedPaymentRequest = {
      completedPaymentRequest: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should not return any payment requests if none completed for agreement', async () => {
    await db.scheme.create(scheme)
    const paymentRequests = await getPreviousPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear)
    expect(paymentRequests.length).toBe(0)
  })

  test('should return completed payment requests for agreement', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    const paymentRequests = await getPreviousPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear)
    expect(paymentRequests.length).toBe(1)
  })
})
