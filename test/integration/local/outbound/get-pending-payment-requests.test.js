const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

jest.mock('../../../../app/remove-null-properties')
const { removeNullProperties: mockRemoveNullProperties } = require('../../../../app/remove-null-properties')

const paymentRequest = require('../../../mocks/payment-requests/payment-request')

const db = require('../../../../app/data')

const { getPendingPaymentRequests } = require('../../../../app/outbound/get-pending-payment-requests')

describe('get pending payment requests', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    mockRemoveNullProperties.mockReturnValue(paymentRequest)
    await resetDatabase()
    await savePaymentRequest(paymentRequest, true)
  })

  test('should return pending payment requests', async () => {
    const pendingPaymentRequests = await getPendingPaymentRequests()
    expect(pendingPaymentRequests.length).toBe(1)
  })

  test('should return payment request with all invoice lines', async () => {
    const pendingPaymentRequests = await getPendingPaymentRequests()
    expect(pendingPaymentRequests[0].invoiceLines.length).toBe(paymentRequest.invoiceLines.length)
  })

  test('should remove null properties from payment request', async () => {
    await getPendingPaymentRequests()
    expect(mockRemoveNullProperties).toHaveBeenCalledTimes(1)
  })

  test('should not return payment requests already submitted', async () => {
    await db.completedPaymentRequest.update({ submitted: new Date() }, { where: { submitted: null } })
    const pendingPaymentRequests = await getPendingPaymentRequests()
    expect(pendingPaymentRequests.length).toBe(0)
  })

  test('should not return payment requests without invoice lines', async () => {
    await db.completedInvoiceLine.destroy({ where: {} })
    const pendingPaymentRequests = await getPendingPaymentRequests()
    expect(pendingPaymentRequests.length).toBe(0)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
