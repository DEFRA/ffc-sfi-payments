const mockFRN = require('../../mock-frn')
const processInvalid = require('../../../app/acknowledgement/process-invalid')
const { SFI } = require('../../../app/schemes')

jest.mock('../../../app/config')
const mockConfig = require('../../../app/config')

jest.mock('../../../app/event')
const mockEvent = require('../../../app/event')

jest.mock('../../../app/acknowledgement/get-payment-request')
const getPaymentRequest = require('../../../app/acknowledgement/get-payment-request')

jest.mock('../../../app/acknowledgement/get-hold-category-name')
const getHoldCategoryName = require('../../../app/acknowledgement/get-hold-category-name')

jest.mock('../../../app/holds/get-hold-category-id')
const getHoldCategoryId = require('../../../app/holds/get-hold-category-id')

jest.mock('../../../app/reschedule/index')
const holdAndReschedule = require('../../../app/reschedule/index')

jest.mock('../../../app/reset/index')
const { resetPaymentRequestById } = require('../../../app/reset/index')

let mockAcknowledgement
let mockAcknowledgementError
let mockHoldCategoryName
let mockHoldCategoryId
let mockHoldReschedule
let mockResetPaymentRequestById

let schemeId
let paymentRequestId

describe('send acknowledgement event', () => {
  beforeEach(() => {
    mockConfig.isAlerting = true

    mockAcknowledgement = require('../../mock-acknowledgement')
    mockAcknowledgementError = require('../../mock-acknowledgement-error')
    
    mockHoldCategoryName = 'DAX rejection'

    schemeId = SFI
    paymentRequestId = 1

    getPaymentRequest.mockReturnValue({
      schemeId,
      paymentRequestId,
      mockFRN: mockAcknowledgementError.frn
    })
    
    getHoldCategoryName.mockReturnValue(
      mockHoldCategoryName
    )

    getHoldCategoryId.mockReturnValue(
      mockHoldCategoryId
    )

    holdAndReschedule.mockReturnValue({
      mockHoldReschedule
    })

    resetPaymentRequestById.mockReturnValue({
      mockResetPaymentRequestById
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should call sendAcknowledgementEvent when an unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementEvent).toHaveBeenCalled()
  })

  test('should call sendAcknowledgementEvent once when an unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendAcknowledgementEvent with a holdCategoryName, an unsuccessful ack object and frn when an unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementEvent).toHaveBeenCalledWith(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
  })

  test('should not call sendAcknowledgementEvent when a successful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgement)
    expect(mockEvent.sendAcknowledgementEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAcknowledgementEvent when an unsuccessful ack object is given but isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAcknowledgementEvent when a successful ack object is given and isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgement)
    expect(mockEvent.sendAcknowledgementEvent).not.toHaveBeenCalled()
  })
})
