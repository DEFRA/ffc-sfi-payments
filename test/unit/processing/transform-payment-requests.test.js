jest.mock('../../../app/processing/confirm-payment-request-number')
const { confirmPaymentRequestNumber } = require('../../../app/processing/confirm-payment-request-number')

jest.mock('../../../app/processing/get-completed-payment-requests')
const getCompletedPaymentRequests = require('../../../app/processing/get-completed-payment-requests')

jest.mock('../../../app/processing/delta')
const calculateDelta = require('../../../app/processing/delta')

jest.mock('../../../app/processing/confirm-due-dates')
const confirmDueDates = require('../../../app/processing/confirm-due-dates')

jest.mock('../../../app/processing/enrichment')
const enrichPaymentRequests = require('../../../app/processing/enrichment')

jest.mock('../../../app/processing/apply-dual-accounting')
const applyDualAccounting = require('../../../app/processing/apply-dual-accounting')

const { SFI, BPS } = require('../../../app/constants/schemes')

const transformPaymentRequest = require('../../../app/processing/transform-payment-request')

let paymentRequest

describe('transform payment request', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = {
      paymentRequestId: 1,
      paymentRequestNumber: 1,
      schemeId: SFI,
      frn: 1234567890,
      marketingYear: 2022,
      invalid: false,
      invoiceLines: []
    }

    confirmPaymentRequestNumber.mockResolvedValue(paymentRequest.paymentRequestNumber)
    getCompletedPaymentRequests.mockResolvedValue([])
    calculateDelta.mockResolvedValue({ completedPaymentRequests: [paymentRequest] })
    confirmDueDates.mockResolvedValue([paymentRequest])
    enrichPaymentRequests.mockResolvedValue([paymentRequest])
    applyDualAccounting.mockResolvedValue([paymentRequest])
  })

  test('should confirm payment request number if BPS', async () => {
    paymentRequest.schemeId = BPS
    await transformPaymentRequest(paymentRequest)
    expect(confirmPaymentRequestNumber).toHaveBeenCalledWith(paymentRequest)
  })

  test('should not confirm payment request number if not BPS', async () => {
    await transformPaymentRequest(paymentRequest)
    expect(confirmPaymentRequestNumber).not.toHaveBeenCalled()
  })
})
