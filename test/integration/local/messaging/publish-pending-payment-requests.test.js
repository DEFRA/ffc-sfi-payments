const mockSendBatchMessages = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageBatchSender: jest.fn().mockImplementation(() => {
      return {
        sendBatchMessages: mockSendBatchMessages,
        closeConnection: jest.fn()
      }
    })
  }
})
const db = require('../../../../app/data')
const publishPendingPaymentRequests = require('../../../../app/messaging/publish-pending-payment-requests')
let scheme
let paymentRequest
let completedPaymentRequest
let completedInvoiceLine

describe('get pending payment requests', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      agreementNumber: 'AG12345678'
    }

    completedPaymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      agreementNumber: 'AG12345678'
    }

    completedInvoiceLine = {
      invoiceLineId: 1,
      completedPaymentRequestId: 1,
      description: 'G00'
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should send completed payment request', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await db.completedInvoiceLine.create(completedInvoiceLine)
    await publishPendingPaymentRequests()
    expect(mockSendBatchMessages).toHaveBeenCalled()
  })
})
