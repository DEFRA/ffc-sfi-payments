jest.mock('../../app/messaging')
const { start: mockStartMessaging } = require('../../app/messaging')
jest.mock('../../app/processing')
const { start: mockStartProcessing } = require('../../app/processing')
jest.mock('../../app/server')
const { start: mockStartServer } = require('../../app/server')

describe('app start', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts processing', async () => {
    expect(mockStartProcessing).toHaveBeenCalledTimes(1)
  })

  test('starts messaging', async () => {
    expect(mockStartMessaging).toHaveBeenCalledTimes(1)
  })

  test('starts server', async () => {
    expect(mockStartServer).toHaveBeenCalledTimes(1)
  })
})
