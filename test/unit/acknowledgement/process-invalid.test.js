const mockFRN = require('../../mock-frn')
const processInvalid = require("../../../app/acknowledgement/process-invalid")
const updateAcknowledgement = require('../../../app/acknowledgement')
const { SFI } = require('../../../app/schemes')

jest.mock('../../../app/config')
const mockConfig = require('../../../app/config')

jest.mock('../../../app/event/send-acknowledgement-event')
const sendAcknowledgementEvent = require('../../../app/event/send-acknowledgement-event')

jest.mock('../../../app/event')
const mockEvent = require('../../../app/event')

jest.mock('../../../app/acknowledgement/acknowledge-payment-request')
const acknowledgePaymentRequest = require('../../../app/acknowledgement/acknowledge-payment-request')

jest.mock('../../../app/acknowledgement/get-payment-request')
const getPaymentRequest = require('../../../app/acknowledgement/get-payment-request')

jest.mock('../../../app/acknowledgement/get-hold-category-name')
const getHoldCategoryName = require('../../../app/acknowledgement/get-hold-category-name')
/*
jest.mock('../../../app/event/send-processing-ack-error-event')
const sendProcessingAckErrorEvent = require('../../../app/event/send-processing-ack-error-event')

jest.mock('../../../app/event/send-invalid-bank-details-event')
const sendInvalidBankDetailsEvent = require('../../../app/event/send-invalid-bank-details-event')
*/
let mockAcknowledgement
let mockAcknowledgementError
let mockHoldCategoryName

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
      frn: mockAcknowledgementError.frn
    })

    getHoldCategoryName.mockReturnValue({
      mockHoldCategoryName
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

test('should call sendAcknowledgementEvent when a holdCategoryName, an unsuccessful ack object and frn is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(sendAcknowledgementEvent).toHaveBeenCalled()
  })
  /*
  test('should call sendAcknowledgementEvent once when a holdCategoryName, an unsuccessful ack object and frn is given and isAlerting is true', async () => {
    await processInvalid(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendAcknowledgementEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendAcknowledgementEvent with the unsuccessful ack object when a holdCategoryName, an unsuccessful ack object and frn is given and isAlerting is true', async () => {
    await processInvalid(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendAcknowledgementEvent).toHaveBeenCalledWith(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
  })

test('should not call sendAcknowledgementEvent with holdCategoryName, an unsuccessful ack object nor frn when an unsuccessful ack object is given and isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendAcknowledgementEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAcknowledgementEvent when a successful ack object is given and isAlerting is true', async () => {
    await processInvalid(mockHoldCategoryName, mockAcknowledgement, mockFRN)
    expect(sendAcknowledgementEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAcknowledgementEvent when a successful ack object is given and isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(mockHoldCategoryName, mockAcknowledgement, mockFRN)
    expect(sendAcknowledgementEvent).not.toHaveBeenCalled()
  })
  */
})
