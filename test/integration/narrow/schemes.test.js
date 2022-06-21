const db = require('../../../app/data')
jest.mock('ffc-messaging')
let createServer
let server
let scheme

describe('schemes routes', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI'
    }

    createServer = require('../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /payment-schemes returns schemes', async () => {
    const options = {
      method: 'GET',
      url: '/payment-schemes'
    }

    await db.scheme.create(scheme)

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })
})
