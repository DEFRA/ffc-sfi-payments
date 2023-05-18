const db = require('../../../../../app/data')
jest.mock('ffc-messaging')
let server
let paymentRequest

describe('Payment request routes', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    await db.scheme.create({
      schemeId: 1,
      name: 'SFI'
    })

    paymentRequest = {
      completedPaymentRequest: 1,
      paymentRequestId: 1,
      schemeId: 1,
      invoiceNumber: 'InvoiceNumber'
    }

    const { createServer } = require('../../../../../app/server/create-server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('POST /payment-requests/reset creates new schedule if no schedule', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: paymentRequest.invoiceNumber
      }
    }

    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)

    const result = await server.inject(options)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId: 1, started: null, completed: null } })
    expect(schedule).toBeDefined()
    expect(result.statusCode).toBe(200)
  })

  test('POST /payment-requests/reset creates new schedule if existing schedule', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: paymentRequest.invoiceNumber
      }
    }

    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.schedule.create({ paymentRequestId: 1, completed: new Date() })

    const result = await server.inject(options)
    const schedule = await db.schedule.findOne({ where: { paymentRequestId: 1, started: null, completed: null } })
    expect(schedule).toBeDefined()
    expect(result.statusCode).toBe(200)
  })

  test('POST /payment-requests/reset invalidates completed', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: paymentRequest.invoiceNumber
      }
    }

    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)

    const result = await server.inject(options)
    const completedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { paymentRequestId: 1 } })
    expect(completedPaymentRequest.invalid).toBe(true)
    expect(result.statusCode).toBe(200)
  })

  test('POST /payment-requests/reset returns error if no payment request', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: paymentRequest.invoiceNumber
      }
    }
    const result = await server.inject(options)
    expect(result.statusCode).toBe(412)
  })

  test('POST /payment-requests/reset returns error if not completed', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: paymentRequest.invoiceNumber
      }
    }
    await db.paymentRequest.create(paymentRequest)
    const result = await server.inject(options)
    expect(result.statusCode).toBe(412)
  })

  test('POST /payment-requests/reset returns error if no invoice number', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: { }
    }
    await db.paymentRequest.create(paymentRequest)
    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /payment-requests/reset returns error if invoice number undefined', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: undefined
      }
    }
    await db.paymentRequest.create(paymentRequest)
    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /payment-requests/reset returns error if invoice number invalid type', async () => {
    const options = {
      method: 'POST',
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: true
      }
    }
    await db.paymentRequest.create(paymentRequest)
    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })
})
