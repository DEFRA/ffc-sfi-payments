const db = require('../../../app/data')
const updateSettlementStatus = require('../../../app/settlement')
let scheme
let paymentRequest
let returnData

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

    returnData = {
      invoiceNumber: 'S12345678A123456V001',
      settled: true,
      settlementDate: new Date(2021, 8, 2)
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should add settlement date to settled', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await updateSettlementStatus(returnData)
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(paymentRequest.paymentRequestId)
    expect(updatedPaymentRequest.settled).toStrictEqual(new Date(2021, 8, 2))
  })

  test('should not add settlement date to unsettled', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    returnData.settled = false
    await updateSettlementStatus(returnData)
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(paymentRequest.paymentRequestId)
    expect(updatedPaymentRequest.settled).toBeNull()
  })
})
