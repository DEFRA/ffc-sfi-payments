const db = require('../../../../app/data')
jest.mock('ffc-messaging')
const mockSendEvents = jest.fn()
jest.mock('ffc-events', () => {
  return {
    EventSender: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn(),
        sendEvents: mockSendEvents,
        closeConnection: jest.fn()
      }
    })
  }
})
let createServer
let server
let scheme
let getPaymentSchemes

describe('holds routes', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    createServer = require('../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  test('GET /payment-schemes returns schemes', async () => {
    const options = {
      method: 'GET',
      url: '/payment-schemes'
    }

    await db.scheme.create(scheme)
    await db.scheme.create(getPaymentSchemes)

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })
})
