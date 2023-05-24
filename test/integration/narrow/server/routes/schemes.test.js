jest.mock('../../../../../app/schemes')
const { getSchemes: mockGetSchemes, updateScheme: mockUpdateScheme } = require('../../../../../app/schemes')

const scheme = require('../../../../mocks/schemes/scheme')

const { GET, POST } = require('../../../../../app/constants/methods')

let server

describe('scheme routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks()

    mockGetSchemes.mockResolvedValue([scheme])

    const { createServer } = require('../../../../../app/server/create-server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /payment-schemes returns schemes if schemes', async () => {
    const options = {
      method: GET,
      url: '/payment-schemes'
    }

    const result = await server.inject(options)
    expect(result.result.paymentSchemes[0]).toMatchObject(scheme)
  })

  test('GET /payment-schemes returns 200 if schemes', async () => {
    const options = {
      method: GET,
      url: '/payment-schemes'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /payment-schemes returns empty array if no schemes', async () => {
    const options = {
      method: GET,
      url: '/payment-schemes'
    }

    mockGetSchemes.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.result.paymentSchemes).toEqual([])
  })

  test('GET /payment-schemes returns 200 if no schemes', async () => {
    const options = {
      method: GET,
      url: '/payment-schemes'
    }

    mockGetSchemes.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /change-payment-status updates scheme status', async () => {
    const options = {
      method: POST,
      url: '/change-payment-status',
      payload: {
        schemeId: scheme.schemeId,
        active: true
      }
    }

    await server.inject(options)
    expect(mockUpdateScheme).toHaveBeenCalledWith(scheme.schemeId, true)
  })

  test('POST /change-payment-status returns 200 if scheme updated', async () => {
    const options = {
      method: POST,
      url: '/change-payment-status',
      payload: {
        schemeId: scheme.schemeId,
        active: true
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test.each([
    '',
    undefined,
    null,
    true,
    false,
    'abc'
  ])('POST /change-payment-status returns 400 if schemeId is %p', async (schemeId) => {
    const options = {
      method: POST,
      url: '/change-payment-status',
      payload: {
        schemeId,
        active: true
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test.each([
    '',
    undefined,
    null,
    'abc',
    1,
    0
  ])('POST /change-payment-status returns 400 if active is %p', async (active) => {
    const options = {
      method: POST,
      url: '/change-payment-status',
      payload: {
        schemeId: scheme.schemeId,
        active
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })
})
