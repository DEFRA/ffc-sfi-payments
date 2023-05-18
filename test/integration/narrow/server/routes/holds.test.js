
jest.mock('../../../../../app/holds')
const { getHolds: mockGetHolds, addHold: mockAddHold, removeHoldById: mockRemoveHoldById, getHoldCategories: mockGetHoldCategories } = require('../../../../../app/holds')

const hold = require('../../../../mocks/holds/hold')
const holdCategory = require('../../../../mocks/holds/hold-category')

const { GET } = require('../../../../../app/constants/methods')

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

  test('GET /payment-holds returns holds', async () => {
    const options = {
      method: GET,
      url: '/payment-holds'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
    expect(result.result.paymentHolds[0]).toMatchObject(hold)
  })
})
