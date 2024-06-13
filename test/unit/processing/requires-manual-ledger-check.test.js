const { requiresManualLedgerCheck } = require('../../../app/processing/requires-manual-ledger-check')
const { processingConfig } = require('../../../app/config')
const { getCompletedPaymentRequests } = require('../../../app/processing/get-completed-payment-requests')
const { ignoreZeroValueSplits } = require('../../../app/processing/ignore-zero-value-splits')
const paymentRequestMock = require('../../mocks/payment-requests/payment-request')

jest.mock('../../../app/processing/get-completed-payment-requests')
jest.mock('../../../app/processing/ignore-zero-value-splits')

describe('check if requires manual ledger check', () => {
  let paymentRequest

  beforeEach(() => {
    jest.clearAllMocks()
    paymentRequest = JSON.parse(JSON.stringify(paymentRequestMock))
  })

  test('returns false when useManualLedgerCheck is false', async () => {
    processingConfig.useManualLedgerCheck = false
    paymentRequest.value = 100
    const result = await requiresManualLedgerCheck(paymentRequest)
    expect(result).toBe(false)
  })

  test('returns false when paymentRequest value is 0', async () => {
    processingConfig.useManualLedgerCheck = true
    paymentRequest.value = 0
    const result = await requiresManualLedgerCheck(paymentRequest)
    expect(result).toBe(false)
  })

  test('returns true when paymentRequest value is less than 0', async () => {
    processingConfig.useManualLedgerCheck = true
    paymentRequest.value = -100
    const result = await requiresManualLedgerCheck(paymentRequest)
    expect(result).toBe(true)
  })

  test('returns false when there are no previous payment requests', async () => {
    processingConfig.useManualLedgerCheck = true
    getCompletedPaymentRequests.mockResolvedValue([])
    ignoreZeroValueSplits.mockReturnValue([])
    paymentRequest.value = 100
    const result = await requiresManualLedgerCheck(paymentRequest)
    expect(result).toBe(false)
  })

  test('returns false when there are no previous negative payment requests', async () => {
    processingConfig.useManualLedgerCheck = true
    const previousPaymentRequests = [
      JSON.parse(JSON.stringify(paymentRequestMock)),
      JSON.parse(JSON.stringify(paymentRequestMock))
    ]
    previousPaymentRequests[0].value = 100
    previousPaymentRequests[1].value = 200

    getCompletedPaymentRequests.mockResolvedValue(previousPaymentRequests)
    ignoreZeroValueSplits.mockReturnValue(previousPaymentRequests)
    paymentRequest.value = 100
    const result = await requiresManualLedgerCheck(paymentRequest)
    expect(result).toBe(false)
  })

  test('returns true when there are previous negative payment requests', async () => {
    processingConfig.useManualLedgerCheck = true
    const previousPaymentRequests = [
      JSON.parse(JSON.stringify(paymentRequestMock)),
      JSON.parse(JSON.stringify(paymentRequestMock))
    ]
    previousPaymentRequests[0].value = 100
    previousPaymentRequests[1].value = -50

    getCompletedPaymentRequests.mockResolvedValue(previousPaymentRequests)
    ignoreZeroValueSplits.mockReturnValue(previousPaymentRequests)
    paymentRequest.value = 100
    const result = await requiresManualLedgerCheck(paymentRequest)
    expect(result).toBe(true)
  })

  test('ignores zero value splits when checking previous payment requests', async () => {
    processingConfig.useManualLedgerCheck = true
    const previousPaymentRequests = [
      JSON.parse(JSON.stringify(paymentRequestMock)),
      JSON.parse(JSON.stringify(paymentRequestMock)),
      JSON.parse(JSON.stringify(paymentRequestMock))
    ]
    previousPaymentRequests[0].value = 100
    previousPaymentRequests[1].value = 50
    previousPaymentRequests[2].value = -50

    getCompletedPaymentRequests.mockResolvedValue(previousPaymentRequests)
    ignoreZeroValueSplits.mockReturnValue([previousPaymentRequests[0], previousPaymentRequests[1]])
    paymentRequest.value = 100
    const result = await requiresManualLedgerCheck(paymentRequest)
    expect(result).toBe(false)
  })
})
