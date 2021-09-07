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
let holdCategory
let hold

describe('holds routes', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    holdCategory = {
      holdCategoryId: 1,
      schemeId: 1,
      name: 'Hold'
    }

    hold = {
      holdId: 1,
      holdCategoryId: 1,
      frn: 1234567890,
      added: new Date()
    }

    createServer = require('../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  test('GET /payment-holds returns holds', async () => {
    const options = {
      method: 'GET',
      url: '/payment-holds'
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
    expect(result.result.paymentHolds[0].frn).toBe('1234567890')
  })

  test('GET /payment-categories returns categories', async () => {
    const options = {
      method: 'GET',
      url: '/payment-hold-categories'
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
    expect(result.result.paymentHoldCategories[0].name).toBe('Hold')
  })

  test('POST /add-payment-hold creates hold', async () => {
    const options = {
      method: 'POST',
      url: '/add-payment-hold',
      payload: {
        frn: 1234567890,
        holdCategoryId: 1
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)

    const result = await server.inject(options)
    const holds = await db.hold.findAll()
    expect(result.statusCode).toBe(200)
    expect(holds.length).toBe(1)
    expect(Number(holds[0].frn)).toBe(1234567890)
  })

  test('POST /add-payment-hold sends add hold event', async () => {
    const options = {
      method: 'POST',
      url: '/add-payment-hold',
      payload: {
        frn: 1234567890,
        holdCategoryId: 1
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)

    await server.inject(options)
    expect(mockSendEvents.mock.calls[0][0][0].type).toBe('uk.gov.sfi.payment.hold.added')
  })

  test('POST /add-payment-hold does not create hold with missing FRN', async () => {
    const options = {
      method: 'POST',
      url: '/add-payment-hold',
      payload: {
        frn: 1234567890
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)

    const result = await server.inject(options)
    const holds = await db.hold.findAll()
    expect(result.statusCode).toBe(400)
    expect(holds.length).toBe(0)
  })

  test('POST /add-payment-hold does not create hold with missing hold category', async () => {
    const options = {
      method: 'POST',
      url: '/add-payment-hold',
      payload: {
        holdCategoryId: 1
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)

    const result = await server.inject(options)
    const holds = await db.hold.findAll()
    expect(result.statusCode).toBe(400)
    expect(holds.length).toBe(0)
  })

  test('POST /remove-payment-hold removes hold', async () => {
    const options = {
      method: 'POST',
      url: '/remove-payment-hold',
      payload: {
        holdId: 1
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)

    const result = await server.inject(options)
    const holds = await db.hold.findAll()
    expect(result.statusCode).toBe(200)
    expect(holds.length).toBe(1)
    expect(holds[0].closed).not.toBeNull()
  })

  test('POST /remove-payment-hold sends hold removed event', async () => {
    const options = {
      method: 'POST',
      url: '/remove-payment-hold',
      payload: {
        holdId: 1
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)

    await server.inject(options)
    expect(mockSendEvents.mock.calls[0][0][0].type).toBe('uk.gov.sfi.payment.hold.removed')
  })

  test('POST /remove-payment-hold does not remove hold with missing holdId', async () => {
    const options = {
      method: 'POST',
      url: '/add-payment-hold',
      payload: {}
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)

    const result = await server.inject(options)
    const holds = await db.hold.findAll()
    expect(result.statusCode).toBe(400)
    expect(holds.length).toBe(1)
    expect(holds[0].closed).toBeNull()
  })

  test('POST /remove-payment-hold does not create hold with missing hold category', async () => {
    const options = {
      method: 'POST',
      url: '/remove-payment-hold',
      payload: {
        holdCategoryId: 1
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)

    const result = await server.inject(options)
    const holds = await db.hold.findAll()
    expect(result.statusCode).toBe(400)
    expect(holds.length).toBe(0)
  })
})
