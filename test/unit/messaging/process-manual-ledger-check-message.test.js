const moment = require('moment')
jest.mock('ffc-messaging')
const db = require('../../../app/data')
const { processManualLedgerCheckMessage } = require('../../../app/messaging/process-manual-ledger-check-message')
let receiver
let message
let scheme
let holdCategory
let hold
let paymentRequest
let schedule

describe('process manual ledger check message', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    holdCategory = {
      holdCategoryId: 1,
      schemeId: 1,
      name: 'Manual ledger hold'
    }

    hold = {
      holdId: 1,
      holdCategoryId: 1,
      frn: 1234567890,
      closed: null
    }

    schedule = {
      scheduleId: 1,
      paymentRequestId: 1,
      planned: moment().subtract(1, 'day')
    }

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      agreementNumber: 'AG12345678',
      invoiceNumber: 'SFI12345678S1234567V002',
      invoiceLines: [
        {
          schemeCode: '80001',
          fundCode: 'DOM00',
          description: 'G00 - Gross value of claim',
          value: 10000,
          accountCode: null
        }],
      paymentRequests: []
    }

    message = {
      body: {
        scheduleId: 1,
        paymentRequest
      }
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)
    await db.paymentRequest.create(paymentRequest)
    await db.schedule.create(schedule)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should not complete payment request as schedule already complete', async () => {
    await db.schedule.update({ completed: true }, { where: { scheduleId: 1 } })
    await processManualLedgerCheckMessage(message, receiver)
    const completedPaymentRequest = await db.completedPaymentRequest.findAll({ where: { paymentRequestId: 1 } })
    expect(completedPaymentRequest.length).toBe(0)
  })

  test('dead letters if no message ledger data in message', async () => {
    message.body = {}
    await processManualLedgerCheckMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('should throw error if no matching original request', async () => {
    message.body.paymentRequest.invoiceNumber = 'XXX'
    await processManualLedgerCheckMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
