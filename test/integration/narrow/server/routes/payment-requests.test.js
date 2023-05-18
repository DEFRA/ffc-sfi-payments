jest.mock('../../../../../app/reset')
const { resetPaymentRequestByInvoiceNumber: mockResetPaymentRequestByInvoiceNumber } = require('../../../../../app/reset')

const { INVOICE_NUMBER } = require('../../../../mocks/values/invoice-number')

const { POST } = require('../../../../../app/constants/methods')

let server

describe('payment request routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks()

    const { createServer } = require('../../../../../app/server/create-server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('POST /payment-request/reset resets payment request by invoice number', async () => {
    const options = {
      method: POST,
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: INVOICE_NUMBER
      }
    }

    await server.inject(options)
    expect(mockResetPaymentRequestByInvoiceNumber).toHaveBeenCalledWith(INVOICE_NUMBER)
  })

  test('POST /payment-request/reset returns 200 if payment reset', async () => {
    const options = {
      method: POST,
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: INVOICE_NUMBER
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test.each([
    { invoiceNumber: null },
    { invoiceNumber: undefined },
    { invoiceNumber: '' },
    { invoiceNumber: true },
    { invoiceNumber: false }
  ])('POST /payment-request/reset returns 400 if invoice number is %p', async (invoiceNumber) => {
    const options = {
      method: POST,
      url: '/payment-request/reset',
      payload: {
        invoiceNumber
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /payment-request/reset returns 412 if payment reset throws', async () => {
    const options = {
      method: POST,
      url: '/payment-request/reset',
      payload: {
        invoiceNumber: INVOICE_NUMBER
      }
    }

    mockResetPaymentRequestByInvoiceNumber.mockRejectedValue(new Error())

    const result = await server.inject(options)
    expect(result.statusCode).toBe(412)
  })
})
