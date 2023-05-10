jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')
jest.mock('../../app/processing')
const mockProcessing = require('../../app/processing')
const mockStart = jest.fn()
jest.mock('../../app/server')
const { createServer: mockCreateServer } = require('../../app/server')

describe('app', () => {
  beforeEach(() => {
    mockCreateServer.mockResolvedValue({ start: mockStart })
    require('../../app')
  })

  test('starts processing', async () => {
    expect(mockProcessing.start).toHaveBeenCalled()
  })

  test('starts messaging', async () => {
    expect(mockMessaging.start).toHaveBeenCalled()
  })

  test('starts server', async () => {
    expect(mockStart).toHaveBeenCalled()
  })
})
