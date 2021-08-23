jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')
jest.mock('../../app/processing')
const mockProcessing = require('../../app/processing')
jest.mock('../../app/server')
const mockServer = require('../../app/server', () => {
  return {
    start: jest.fn()
  }
})
jest.useFakeTimers()

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts processing', async () => {
    expect(mockProcessing.start).toHaveBeenCalled()
  })

  test('starts messaging', async () => {
    expect(mockMessaging.start).toHaveBeenCalled()
  })

  test('starts server', async () => {
    expect(mockServer).toHaveBeenCalled()
  })
})
