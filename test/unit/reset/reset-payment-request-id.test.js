jest.mock('../../../app/reschedule')
const { ensureScheduled: mockEnsureScheduled } = require('../../../app/reschedule')

jest.mock('../../../app/reset/reset-reference-id')
const { resetReferenceId: mockResetReferenceId } = require('../../../app/reset/reset-reference-id')

jest.mock('../../../app/reset/invalidate-payment-requests')
const { invalidatePaymentRequests: mockInvalidatePaymentRequests } = require('../../../app/reset/invalidate-payment-requests')

const { resetPaymentRequestById } = require('../../../app/reset/reset-payment-request-id')

const paymentRequestId = 1
const transaction = {}

describe('reset payment request id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should reset reference id for completed payment request', async () => {
    await resetPaymentRequestById(paymentRequestId, transaction)
    expect(mockResetReferenceId).toHaveBeenCalledWith(paymentRequestId, transaction)
  })

  test('should invalidate completed payment request', async () => {
    await resetPaymentRequestById(paymentRequestId, transaction)
    expect(mockInvalidatePaymentRequests).toHaveBeenCalledWith(paymentRequestId, transaction)
  })

  test('should ensure payment request is scheduled for re-processing', async () => {
    await resetPaymentRequestById(paymentRequestId, transaction)
    expect(mockEnsureScheduled).toHaveBeenCalledWith(paymentRequestId, transaction)
  })
})
