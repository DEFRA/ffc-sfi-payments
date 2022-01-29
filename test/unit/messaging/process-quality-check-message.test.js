const db = require('../../../app/data')
const processQualityCheckMessage = require('../../../app/messaging/process-quality-check-message')
let scheme
let paymentRequest
let completedPaymentRequest
let receiver
let message

describe('process quality check message', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }

    message = {
      body: {
        invoiceNumber: 'SFI12345678S1234567V002',
        debtType: 'adm',
        recoveryDate: '02/05/2019'
      }
    }

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
      agreementNumber: 'AG12345678',
      invoiceNumber: 'SFI12345678S1234567V002'
    }

    completedPaymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      agreementNumber: 'AG12345678',
      awaitingEnrichment: true
    }

    await db.scheme.create(scheme)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should complete valid message', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await processQualityCheckMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should update debt data', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await processQualityCheckMessage(message, receiver)
    const updatedCompletedPaymentRequest = await db.completedPaymentRequest.findByPk(1)
    expect(updatedCompletedPaymentRequest.debtType).toBe(message.body.debtType)
    expect(updatedCompletedPaymentRequest.recoveryDate).toBe(message.body.recoveryDate)
  })

  test('should set as no longer awaiting enrichment', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await processQualityCheckMessage(message, receiver)
    const updatedCompletedPaymentRequest = await db.completedPaymentRequest.findByPk(1)
    expect(updatedCompletedPaymentRequest.awaitingEnrichment).toBeFalsy()
  })

  test('dead letters if no debt data in message', async () => {
    message.body = {}
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await processQualityCheckMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('should throw error if no matching original request', async () => {
    message.body.invoiceNumber = 'XXX'
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(completedPaymentRequest)
    await processQualityCheckMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
