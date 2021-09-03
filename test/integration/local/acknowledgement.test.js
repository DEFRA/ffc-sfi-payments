const db = require('../../../app/data')
const updateAcknowledgement = require('../../../app/acknowledgement')
let scheme
let paymentRequest
let acknowledgement

describe('update settlement status', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    paymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      invoiceNumber: 'S12345678A123456V001'
    }

    acknowledgement = {
      invoiceNumber: 'S12345678A123456V001',
      acknowledged: new Date(2021, 8, 2),
      success: true
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should add acknowledged date if success', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await updateAcknowledgement(acknowledgement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(paymentRequest.paymentRequestId)
    expect(updatedPaymentRequest.acknowledged).toStrictEqual(new Date(2021, 8, 2))
  })

  test('should not add acknowledged date to failure', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(paymentRequest.paymentRequestId)
    expect(updatedPaymentRequest.acknowledged).toBeNull()
  })
})
