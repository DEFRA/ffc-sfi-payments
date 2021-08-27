
const db = require('../../../../app/data')
const updatePendingPaymentRequests = require('../../../../app/messaging/update-pending-payment-requests')
let scheme
let paymentRequest
let completedPaymentRequest

describe('get pending payment requests', () => {
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
      marketingYear: 2022,
      agreementNumber: 'AG12345678'
    }

    completedPaymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      agreementNumber: 'AG12345678'
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should update submitted', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await updatePendingPaymentRequests([completedPaymentRequest], new Date())
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(1)
    expect(updatedPaymentRequest.submitted).not.toBeNull()
  })
})
