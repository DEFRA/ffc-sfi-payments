const db = require('../../../../app/data')

const { confirmPaymentRequestNumber } = require('../../../../app/processing/confirm-payment-request-number')

let scheme
let paymentRequest

describe('confirm payment request number', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    paymentRequest = {
      paymentRequestId: 1,
      paymentRequestNumber: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      invalid: false
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should retain existing payment request number if no matches', async () => {
    await db.scheme.create(scheme)
    const paymentRequestNumber = await confirmPaymentRequestNumber(paymentRequest)
    expect(paymentRequestNumber).toBe(paymentRequest.paymentRequestNumber)
  })

  test('should retain existing payment request number if previous payment request lower number', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    paymentRequest.paymentRequestNumber = 2
    const paymentRequestNumber = await confirmPaymentRequestNumber(paymentRequest)
    expect(paymentRequestNumber).toBe(paymentRequest.paymentRequestNumber)
  })

  test('should increment payment request number if previous payment request equal number', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    const paymentRequestNumber = await confirmPaymentRequestNumber(paymentRequest)
    expect(paymentRequestNumber).toBe(paymentRequest.paymentRequestNumber + 1)
  })

  test('should increment payment request number if previous payment request higher number', async () => {
    await db.scheme.create(scheme)
    paymentRequest.paymentRequestNumber = 2
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    paymentRequest.paymentRequestNumber = 1
    const paymentRequestNumber = await confirmPaymentRequestNumber(paymentRequest)
    expect(paymentRequestNumber).toBe(3)
  })
})
