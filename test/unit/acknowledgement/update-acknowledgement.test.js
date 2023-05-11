jest.mock('ffc-messaging')

jest.mock('../../../app/config')
const { processingConfig: mockConfig } = require('../../../app/config')

jest.mock('../../../app/acknowledgement/acknowledge-payment-request')
const acknowledgePaymentRequest = require('../../../app/acknowledgement/acknowledge-payment-request')

jest.mock('../../../app/acknowledgement/get-payment-request')
const getPaymentRequest = require('../../../app/acknowledgement/get-payment-request')

jest.mock('../../../app/acknowledgement/process-invalid')
const processInvalid = require('../../../app/acknowledgement/process-invalid')

const { processAcknowledgement } = require('../../../app/acknowledgement')
const { SFI } = require('../../../app/constants/schemes')

let mockAcknowledgement
let mockAcknowledgementError

let schemeId
let paymentRequestId

describe('update acknowledgement', () => {
  beforeEach(() => {
    mockConfig.isAlerting = true

    mockAcknowledgement = JSON.parse(JSON.stringify(require('../../mocks/acknowledgement')))
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mocks/acknowledgement-error')))

    schemeId = SFI
    paymentRequestId = 1

    getPaymentRequest.mockReturnValue({
      schemeId,
      paymentRequestId,
      frn: mockAcknowledgementError.frn
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should call acknowledgePaymentRequest when a successful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgement)
    expect(acknowledgePaymentRequest).toHaveBeenCalled()
  })

  test('should call acknowledgePaymentRequest once when a successful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgement)
    expect(acknowledgePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call acknowledgePaymentRequest with invoiceNumber and acknowledged when a successful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgement)
    expect(acknowledgePaymentRequest).toHaveBeenCalledWith(mockAcknowledgement.invoiceNumber, mockAcknowledgement.acknowledged)
  })

  test('should call acknowledgePaymentRequest when an unsuccessful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(acknowledgePaymentRequest).toHaveBeenCalled()
  })

  test('should call acknowledgePaymentRequest once when an unsuccessful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(acknowledgePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call acknowledgePaymentRequest with invoiceNumber and acknowledged when an unsuccessful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(acknowledgePaymentRequest).toHaveBeenCalledWith(mockAcknowledgementError.invoiceNumber, mockAcknowledgementError.acknowledged)
  })

  test('should call getPaymentRequest', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(getPaymentRequest).toHaveBeenCalled()
  })

  test('should call getPaymentRequest once', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(getPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call getPaymentRequest with invoiceNumber', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(getPaymentRequest).toHaveBeenCalledWith(mockAcknowledgementError.invoiceNumber)
  })

  test('should not call getPaymentRequest when a successful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgement)
    expect(getPaymentRequest).not.toHaveBeenCalled()
  })

  test('should call processInvalid', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(processInvalid).toHaveBeenCalled()
  })

  test('should call processInvalid once', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(processInvalid).toHaveBeenCalledTimes(1)
  })

  test('should call processInvalid with schemeId, paymentRequestId, frn and unsuccessful ack object', async () => {
    await processAcknowledgement(mockAcknowledgementError)
    expect(processInvalid).toHaveBeenCalledWith(schemeId, paymentRequestId, mockAcknowledgementError.frn, mockAcknowledgementError)
  })

  test('should not call processInvalid when a successful ack object is given', async () => {
    await processAcknowledgement(mockAcknowledgement)
    expect(processInvalid).not.toHaveBeenCalled()
  })
})
