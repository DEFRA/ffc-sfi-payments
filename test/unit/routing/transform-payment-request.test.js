jest.mock('../../../app/processing/get-completed-payment-requests')
const { getCompletedPaymentRequests: mockGetCompletedPaymentRequests } = require('../../../app/processing/get-completed-payment-requests')

jest.mock('../../../app/processing/due-dates')
const { confirmDueDates: mockConfirmDueDates } = require('../../../app/processing/due-dates')

jest.mock('../../../app/processing/enrichment')
const { enrichPaymentRequests: mockEnrichPaymentRequests } = require('../../../app/processing/enrichment')

const paymentRequest = require('../../mocks/payment-requests/payment-request')

const { transformPaymentRequest } = require('../../../app/routing/transform-payment-request')

describe('transform payment request', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCompletedPaymentRequests.mockResolvedValue([paymentRequest])
    mockConfirmDueDates.mockReturnValue([paymentRequest])
    mockEnrichPaymentRequests.mockReturnValue([paymentRequest])
  })

  test('should get all previous completed payment requests', async () => {
    await transformPaymentRequest(paymentRequest, [paymentRequest])
    expect(mockGetCompletedPaymentRequests).toHaveBeenCalledWith(paymentRequest)
  })

  test('should confirm due dates of payment requests received from ledger check', async () => {
    await transformPaymentRequest(paymentRequest, [paymentRequest])
    expect(mockConfirmDueDates).toHaveBeenCalledWith([paymentRequest], [paymentRequest])
  })

  test('should enrich payment requests received from ledger check', async () => {
    await transformPaymentRequest(paymentRequest, [paymentRequest])
    expect(mockEnrichPaymentRequests).toHaveBeenCalledWith([paymentRequest], [paymentRequest])
  })
})
