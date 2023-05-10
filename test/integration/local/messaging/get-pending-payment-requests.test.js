const db = require('../../../../app/data')
const { getPendingPaymentRequests } = require('../../../../app/messaging/get-pending-payment-requests')
let scheme
let paymentRequest
let completedPaymentRequest
let completedInvoiceLine

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

    completedInvoiceLine = {
      invoiceLineId: 1,
      completedPaymentRequestId: 1,
      description: 'G00'
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should not return any payment requests if none completed for agreement', async () => {
    await db.scheme.create(scheme)
    const paymentRequests = await getPendingPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return any payment requests if no invoice lines', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    const paymentRequests = await getPendingPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return any payment requests not submitted', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await db.completedInvoiceLine.create(completedInvoiceLine)
    const paymentRequests = await getPendingPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return any payment requests submitted', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    completedPaymentRequest.submitted = new Date()
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await db.completedInvoiceLine.create(completedInvoiceLine)
    const paymentRequests = await getPendingPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })
})
