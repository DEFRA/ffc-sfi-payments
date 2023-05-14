const mockPublishEvent = jest.fn()
const MockEventPublisher = jest.fn().mockImplementation(() => {
  return {
    publishEvent: mockPublishEvent
  }
})
jest.mock('ffc-pay-event-publisher', () => {
  return {
    EventPublisher: MockEventPublisher
  }
})
jest.mock('../../../app/config')
const { processingConfig, messageConfig } = require('../../../app/config')
const { HOLD_PREFIX } = require('../../../app/constants/events')
const { ADDED, REMOVED } = require('../../../app/constants/hold-statuses')
const { SOURCE } = require('../../../app/constants/source')
jest.mock('../../../app/holds/get-scheme-id')
const { getSchemeId } = require('../../../app/holds/get-scheme-id')
const { sendHoldEvent } = require('../../../app/event/send-hold-event')

let hold
let status

beforeEach(() => {
  getSchemeId.mockResolvedValue(1)
  hold = JSON.parse(JSON.stringify(require('../../_test/mocks/hold')))
  status = ADDED
  processingConfig.useV2Events = true
  messageConfig.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V2 hold event', () => {
  test('should send V2 event if V2 events enabled', async () => {
    processingConfig.useV2Events = true
    await sendHoldEvent(hold, status)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event if V2 events disabled', async () => {
    processingConfig.useV2Events = false
    await sendHoldEvent(hold, status)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send event to V2 topic', async () => {
    await sendHoldEvent(hold, status)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messageConfig.eventsTopic)
  })

  test('should raise event with processing source', async () => {
    await sendHoldEvent(hold, status)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise hold added event type if hold added', async () => {
    await sendHoldEvent(hold, status)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(`${HOLD_PREFIX}.${ADDED}`)
  })

  test('should raise hold added event type if hold removed', async () => {
    status = REMOVED
    await sendHoldEvent(hold, status)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(`${HOLD_PREFIX}.${REMOVED}`)
  })

  test('should raise event with hold data', async () => {
    await sendHoldEvent(hold, status)
    expect(mockPublishEvent.mock.calls[0][0].data).toMatchObject(hold)
  })

  test('should raise event with scheme Id', async () => {
    await sendHoldEvent(hold, status)
    expect(mockPublishEvent.mock.calls[0][0].data.schemeId).toBe(1)
  })
})
