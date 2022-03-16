const db = require('../../../app/data')
const processDebtResponseMessage = require('../../../app/messaging/process-debt-response-message')
let scheme
let holdCategory
let hold
let paymentRequest
let receiver
let message

describe('process debt response message', () => {
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

    holdCategory = {
      holdCategoryId: 1,
      schemeId: 1,
      name: 'Awaiting debt enrichment'
    }

    hold = {
      holdId: 1,
      holdCategoryId: 1,
      frn: 1234567890,
      closed: null
    }

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      agreementNumber: 'AG12345678',
      invoiceNumber: 'SFI12345678S1234567V002'
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)
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
    await processDebtResponseMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should update debt data', async () => {
    await db.paymentRequest.create(paymentRequest)
    await processDebtResponseMessage(message, receiver)
    const updatedPaymentRequest = await db.paymentRequest.findByPk(1)
    expect(updatedPaymentRequest.debtType).toBe(message.body.debtType)
    expect(updatedPaymentRequest.recoveryDate).toBe(message.body.recoveryDate)
  })

  test('should remove hold', async () => {
    await db.paymentRequest.create(paymentRequest)
    await processDebtResponseMessage(message, receiver)
    const updatedHold = await db.hold.findByPk(1)
    expect(updatedHold.closed).not.toBeNull()
  })

  test('dead letters if no debt data in message', async () => {
    message.body = {}
    await db.paymentRequest.create(paymentRequest)
    await processDebtResponseMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('should dead letter if no matching original request', async () => {
    message.body.invoiceNumber = 'XXX'
    await db.paymentRequest.create(paymentRequest)
    await processDebtResponseMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
