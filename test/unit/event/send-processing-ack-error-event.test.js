const mockUUID = require('../../mock-uuid')
const mockAcknowledgementError = require('../../mock-acknowledgement-error')

jest.mock('uuid')
const { v4: uuidv4 } = require('uuid')
uuidv4.mockReturnValue(mockUUID)

jest.mock('../../../app/event/raise-event')
const raiseEvent = require('../../../app/event/raise-event')

const sendProcessingAckErrorEvent = require('../../../app/event/send-processing-ack-error-event')

let mockEvent

describe('send processing ack error event', () => {
  beforeEach(async () => {
    uuidv4.mockReturnValue(mockUUID)

    mockEvent = {
      id: mockUUID,
      name: 'payment-request-acknowledged-error',
      type: 'error',
      message: 'Payment request acknowledged errored in DAX',
      data: { mockAcknowledgementError }
    }
  })

  afterEach(async () => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should call uuidv4 when an ack object is given', async () => {
    await sendProcessingAckErrorEvent(mockAcknowledgementError)
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when an empty ack object is given', async () => {
    await sendProcessingAckErrorEvent({})
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when undefined is given', async () => {
    await sendProcessingAckErrorEvent(undefined)
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when null is given', async () => {
    await sendProcessingAckErrorEvent(null)
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when an empty string is given', async () => {
    await sendProcessingAckErrorEvent('')
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 once when an ack object is given', async () => {
    await sendProcessingAckErrorEvent(mockAcknowledgementError)
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when an empty ack object is given', async () => {
    await sendProcessingAckErrorEvent({})
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when undefined is given', async () => {
    await sendProcessingAckErrorEvent(undefined)
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when null is given', async () => {
    await sendProcessingAckErrorEvent(null)
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when an empty string is given', async () => {
    await sendProcessingAckErrorEvent('')
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 with no parameters when an ack object is given', async () => {
    await sendProcessingAckErrorEvent(mockAcknowledgementError)
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when an empty ack object is given', async () => {
    await sendProcessingAckErrorEvent({})
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when undefined is given', async () => {
    await sendProcessingAckErrorEvent(undefined)
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when null is given', async () => {
    await sendProcessingAckErrorEvent(null)
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when an empty string is given', async () => {
    await sendProcessingAckErrorEvent('')
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call raiseEvent when an ack object is given', async () => {
    await sendProcessingAckErrorEvent(mockAcknowledgementError)
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when an empty ack object is given', async () => {
    await sendProcessingAckErrorEvent({})
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when undefined is given', async () => {
    await sendProcessingAckErrorEvent(undefined)
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when null is given', async () => {
    await sendProcessingAckErrorEvent(null)
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when an empty string is given', async () => {
    await sendProcessingAckErrorEvent('')
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent once when an ack object is given', async () => {
    await sendProcessingAckErrorEvent(mockAcknowledgementError)
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when an empty ack object is given', async () => {
    await sendProcessingAckErrorEvent({})
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when undefined is given', async () => {
    await sendProcessingAckErrorEvent(undefined)
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when null is given', async () => {
    await sendProcessingAckErrorEvent(null)
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when an empty string is given', async () => {
    await sendProcessingAckErrorEvent('')
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent with mockEvent when an ack object is given', async () => {
    mockEvent.data = { acknowledgement: mockAcknowledgementError }
    await sendProcessingAckErrorEvent(mockAcknowledgementError)
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with an empty object acknowledgement data when an empty ack object is given', async () => {
    mockEvent.data = { acknowledgement: {} }
    await sendProcessingAckErrorEvent({})
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with undefined acknowledgement data when undefined is given', async () => {
    mockEvent.data = { acknowledgement: undefined }
    await sendProcessingAckErrorEvent(undefined)
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with null acknowledgement data when null is given', async () => {
    mockEvent.data = { acknowledgement: null }
    await sendProcessingAckErrorEvent(null)
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with an empty string acknowledgement data when an empty string is given', async () => {
    mockEvent.data = { acknowledgement: '' }
    await sendProcessingAckErrorEvent('')
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should return undefined when an ack object is given', async () => {
    const result = await sendProcessingAckErrorEvent(mockAcknowledgementError)
    expect(result).toBeUndefined()
  })

  test('should return undefined when an empty ack object is given', async () => {
    const result = await sendProcessingAckErrorEvent({})
    expect(result).toBeUndefined()
  })

  test('should return undefined when undefined is given', async () => {
    const result = await sendProcessingAckErrorEvent(undefined)
    expect(result).toBeUndefined()
  })

  test('should return undefined when null is given', async () => {
    const result = await sendProcessingAckErrorEvent(null)
    expect(result).toBeUndefined()
  })

  test('should return undefined when an empty string is given', async () => {
    const result = await sendProcessingAckErrorEvent('')
    expect(result).toBeUndefined()
  })
})
