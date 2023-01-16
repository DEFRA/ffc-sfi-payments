jest.mock('../../../app/config')
const mockConfig = require('../../../app/config')

jest.mock('../../../app/event')
const mockEvent = require('../../../app/event')

jest.mock('../../../app/acknowledgement/get-hold-category-name')
const getHoldCategoryName = require('../../../app/acknowledgement/get-hold-category-name')

jest.mock('../../../app/holds/get-hold-category-id')
const getHoldCategoryId = require('../../../app/holds/get-hold-category-id')

jest.mock('../../../app/reschedule/index')
const holdAndReschedule = require('../../../app/reschedule/index')

jest.mock('../../../app/reset/index')
const { resetPaymentRequestById } = require('../../../app/reset/index')

const mockFRN = require('../../mock-frn')
const processInvalid = require('../../../app/acknowledgement/process-invalid')
const { SFI } = require('../../../app/schemes')

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

    mockAcknowledgement = JSON.parse(JSON.stringify(require('../../mock-acknowledgement')))
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mock-acknowledgement-error')))
    mockHoldCategoryName = 'DAX rejection'

    schemeId = SFI
    paymentRequestId = 1

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

  test('should call sendAckowledgementErrorEvent when an unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAckowledgementErrorEvent).toHaveBeenCalled()
  })

  test('should call sendAckowledgementErrorEvent once when an unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAckowledgementErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendAckowledgementErrorEvent with a holdCategoryName, an unsuccessful ack object and frn when an unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAckowledgementErrorEvent).toHaveBeenCalledWith(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
  })

  test('should not call sendAckowledgementErrorEvent when a successful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgement)
    expect(mockEvent.sendAckowledgementErrorEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAckowledgementErrorEvent when an unsuccessful ack object is given but isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAckowledgementErrorEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAckowledgementErrorEvent when a successful ack object is given and isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgement)
    expect(mockEvent.sendAckowledgementErrorEvent).not.toHaveBeenCalled()
  })
})
