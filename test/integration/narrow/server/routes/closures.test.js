jest.mock('../../../../../app/closures')
const { getClosureCount: mockGetClosureCount, addClosure: mockAddClosure, addBulkClosure: mockAddBulkClosure } = require('../../../../../app/closures')

const closure = require('../../../../mocks/closure/closure-db-entry')

const { GET, POST } = require('../../../../../app/constants/methods')

let server

describe('closures routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks()

    mockGetClosureCount.mockResolvedValue([closure])

    const { createServer } = require('../../../../../app/server/create-server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /agreement-closures returns closures if closures', async () => {
    const options = {
      method: GET,
      url: '/agreement-closures'
    }

    const result = await server.inject(options)
    expect(result.result.closures[0]).toMatchObject(closure)
  })

  test('GET /agreement-closures returns 200 if closures', async () => {
    const options = {
      method: GET,
      url: '/agreement-closures'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /agreement-closures returns empty array if no closures', async () => {
    const options = {
      method: GET,
      url: '/agreement-closures'
    }

    mockGetClosureCount.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.result.closures).toEqual([])
  })

  test('GET /agreement-closures returns 200 if no closures', async () => {
    const options = {
      method: GET,
      url: '/agreement-closures'
    }

    mockGetClosureCount.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /closure should add closure for given details', async () => {
    const options = {
      method: POST,
      url: '/closure',
      payload: {
        frn: closure.frn,
        agreementNumber: closure.agreementNumber,
        closureDate: closure.closureDate
      }
    }

    await server.inject(options)
    expect(mockAddClosure).toHaveBeenCalledWith(closure.frn, closure.agreementNumber, closure.closureDate)
  })

  test('POST /closure returns 200 if closure added', async () => {
    const options = {
      method: POST,
      url: '/closure',
      payload: {
        frn: closure.frn,
        agreementNumber: closure.agreementNumber,
        closureDate: closure.closureDate
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /closure returns 500 if closure cannot be created', async () => {
    mockAddClosure.mockRejectedValue(new Error('Test error'))

    const options = {
      method: POST,
      url: '/closure',
      payload: {
        frn: closure.frn,
        agreementNumber: closure.agreementNumber,
        closureDate: closure.closureDate
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(500)
  })

  test('POST /bulk-closure should add closures for given details', async () => {
    const options = {
      method: POST,
      url: '/bulk-closure',
      payload: {
        data: [{
          frn: closure.frn,
          agreementNumber: closure.agreementNumber,
          closureDate: closure.closureDate
        }]
      }
    }

    await server.inject(options)
    expect(mockAddBulkClosure).toHaveBeenCalledWith([{
      frn: closure.frn,
      agreementNumber: closure.agreementNumber,
      closureDate: closure.closureDate
    }])
  })

  test('POST /bulk-closure returns 200 if closure added', async () => {
    const options = {
      method: POST,
      url: '/bulk-closure',
      payload: {
        data: [{
          frn: closure.frn,
          agreementNumber: closure.agreementNumber,
          closureDate: closure.closureDate
        }]
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /bulk-closure returns 500 if closure cannot be created', async () => {
    mockAddBulkClosure.mockRejectedValue(new Error('Test error'))

    const options = {
      method: POST,
      url: '/bulk-closure',
      payload: {
        data: [{
          frn: closure.frn,
          agreementNumber: closure.agreementNumber,
          closureDate: closure.closureDate
        }]
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(500)
  })
})
