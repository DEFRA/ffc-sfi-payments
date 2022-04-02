const db = require('../../../app/data')
jest.mock('ffc-messaging')
let createServer
let server
let paymentRequest

describe('schemes routes', () => {
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

    createServer = require('../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('POST /payment-requests resets creates new schedule if no schedule', async () => {
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

  
})
