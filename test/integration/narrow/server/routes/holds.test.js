
jest.mock('../../../../../app/holds')
const { getHolds: mockGetHolds, addHold: mockAddHold, removeHoldById: mockRemoveHoldById, getHoldCategories: mockGetHoldCategories } = require('../../../../../app/holds')

const hold = require('../../../../mocks/holds/hold')
const holdCategory = require('../../../../mocks/holds/hold-category')

const { GET, POST } = require('../../../../../app/constants/methods')

const holdId = 1

let server

describe('holds routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks()

    mockGetHolds.mockResolvedValue([hold])
    mockGetHoldCategories.mockResolvedValue([holdCategory])

    const { createServer } = require('../../../../../app/server/create-server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /payment-holds returns holds if holds', async () => {
    const options = {
      method: GET,
      url: '/payment-holds'
    }

    const result = await server.inject(options)
    expect(result.result.paymentHolds[0]).toMatchObject(hold)
  })

  test('GET /payment-holds returns 200 if holds', async () => {
    const options = {
      method: GET,
      url: '/payment-holds'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /payment-holds returns empty array if no holds', async () => {
    const options = {
      method: GET,
      url: '/payment-holds'
    }

    mockGetHolds.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.result.paymentHolds).toEqual([])
  })

  test('GET /payment-holds returns 200 if no holds', async () => {
    const options = {
      method: GET,
      url: '/payment-holds'
    }

    mockGetHolds.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /payment-hold-categories returns hold categories if hold categories', async () => {
    const options = {
      method: GET,
      url: '/payment-hold-categories'
    }

    const result = await server.inject(options)
    expect(result.result.paymentHoldCategories[0]).toMatchObject(holdCategory)
  })

  test('GET /payment-hold-categories returns 200 if hold categories', async () => {
    const options = {
      method: GET,
      url: '/payment-hold-categories'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /payment-hold-categories returns empty array if no hold categories', async () => {
    const options = {
      method: GET,
      url: '/payment-hold-categories'
    }

    mockGetHoldCategories.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.result.paymentHoldCategories).toEqual([])
  })

  test('GET /payment-hold-categories returns 200 if no hold categories', async () => {
    const options = {
      method: GET,
      url: '/payment-hold-categories'
    }

    mockGetHoldCategories.mockResolvedValue([])

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /add-payment-hold should add hold for FRN and category', async () => {
    const options = {
      method: POST,
      url: '/add-payment-hold',
      payload: {
        frn: hold.frn,
        holdCategoryId: hold.holdCategoryId
      }
    }

    await server.inject(options)
    expect(mockAddHold).toHaveBeenCalledWith(hold.frn, hold.holdCategoryId)
  })

  test('POST /add-payment-hold returns 200 if hold added', async () => {
    const options = {
      method: POST,
      url: '/add-payment-hold',
      payload: {
        frn: hold.frn,
        holdCategoryId: hold.holdCategoryId
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test.each([
    { frn: 'abc' },
    { frn: '123456789' },
    { frn: false },
    { frn: true },
    { frn: undefined },
    { frn: null },
    { frn: '' }
  ])('POST /add-payment-hold returns 400 if FRN invalid', async (frn) => {
    const options = {
      method: POST,
      url: '/add-payment-hold',
      payload: {
        frn,
        holdCategoryId: hold.holdCategoryId
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test.each([
    { holdCategoryId: 'abc' },
    { holdCategoryId: '123456789' },
    { holdCategoryId: false },
    { holdCategoryId: true },
    { holdCategoryId: undefined },
    { holdCategoryId: null },
    { holdCategoryId: '' }
  ])('POST /add-payment-hold returns 400 if hold category id invalid', async (holdCategoryId) => {
    const options = {
      method: POST,
      url: '/add-payment-hold',
      payload: {
        frn: hold.frn,
        holdCategoryId
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /add-payment-hold returns 500 if hold cannot be created', async () => {
    mockAddHold.mockRejectedValue(new Error('Test error'))

    const options = {
      method: POST,
      url: '/add-payment-hold',
      payload: {
        frn: hold.frn,
        holdCategoryId: hold.holdCategoryId
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(500)
  })

  test('POST /remove-payment-hold should remove hold for hold id', async () => {
    const options = {
      method: POST,
      url: '/remove-payment-hold',
      payload: {
        holdId
      }
    }

    await server.inject(options)
    expect(mockRemoveHoldById).toHaveBeenCalledWith(holdId)
  })

  test('POST /remove-payment-hold returns 200 if hold removed', async () => {
    const options = {
      method: POST,
      url: '/remove-payment-hold',
      payload: {
        holdId
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test.each([
    { holdId: 'abc' },
    { holdId: '123456789' },
    { holdId: false },
    { holdId: true },
    { holdId: undefined },
    { holdId: null },
    { holdId: '' }
  ])('POST /remove-payment-hold returns 400 if hold id invalid', async (holdId) => {
    const options = {
      method: POST,
      url: '/remove-payment-hold',
      payload: {
        holdId
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /remove-payment-hold returns 500 if hold cannot be removed', async () => {
    mockRemoveHoldById.mockRejectedValue(new Error('Test error'))
    const options = {
      method: POST,
      url: '/remove-payment-hold',
      payload: {
        holdId
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(500)
  })
})
