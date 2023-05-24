const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

const paymentRequest = require('../../../mocks/payment-requests/payment-request')

const { getPaymentRequest } = require('../../../../app/acknowledgement/get-payment-request')

describe('acknowledge payment request', () => {
  beforeEach(async () => {
    await resetDatabase()
    await savePaymentRequest(paymentRequest, true)
  })

  test('should get payment request if matching invoice number', async () => {
    const matchedPaymentRequest = await getPaymentRequest(paymentRequest.invoiceNumber)
    expect(matchedPaymentRequest.invoiceNumber).toEqual(paymentRequest.invoiceNumber)
  })

  test('should not get payment request if not matching invoice number', async () => {
    const matchedPaymentRequest = await getPaymentRequest('not matching invoice number')
    expect(matchedPaymentRequest).toEqual(null)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
