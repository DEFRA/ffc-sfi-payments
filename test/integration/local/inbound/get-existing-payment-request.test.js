const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

const paymentRequest = require('../../../mocks/payment-requests/payment-request')

const { getExistingPaymentRequest } = require('../../../../app/inbound/get-existing-payment-request')

describe('get existing payment request', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    await savePaymentRequest(paymentRequest)
  })

  test('should return payment request if invoice number exists', async () => {
    const paymentRequestResult = await getExistingPaymentRequest(paymentRequest.invoiceNumber)
    expect(paymentRequestResult.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('should return null if invoice number does not exist', async () => {
    const paymentRequestResult = await getExistingPaymentRequest('999')
    expect(paymentRequestResult).toBeNull()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
