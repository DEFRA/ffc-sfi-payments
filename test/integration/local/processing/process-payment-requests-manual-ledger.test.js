const db = require('../../../../app/data')
const config = require('../../../../app/config')
const processPaymentRequests = require('../../../../app/processing/process-payment-requests')
const moment = require('moment')
const { IRREGULAR } = require('../../../../app/debt-types')
const mockSendMessage = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: jest.fn()
      }
    })
  }
})
let paymentRequest
let schedule
let invoiceLine

describe('process payment requests with manual ledger flag', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })

    await db.scheme.create({
      schemeId: 1,
      name: 'SFI',
      active: true
    })

    await db.accountCode.create({
      accountCodeId: 1,
      schemeId: 1,
      lineDescription: 'G00 - Gross value of claim',
      accountCodeAP: 'SOS273',
      accountCodeARIrr: 'SOS274',
      accountCodeARAdm: 'SOS275'
    })

    await db.holdCategory.create({
      holdCategoryId: 1,
      schemeId: 1,
      name: 'Manual ledger hold'
    })

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      invoiceNumber: 'S12345678SIP123456V001',
      value: 100,
      paymentRequestNumber: 1,
      debtType: IRREGULAR
    }

    invoiceLine = {
      invoiceLineId: 1,
      paymentRequestId: 1,
      description: 'G00 - Gross value of claim',
      schemeCode: '80001',
      fundCode: 'DRD10',
      value: 100
    }

    schedule = {
      scheduleId: 1,
      paymentRequestId: 1,
      planned: moment().subtract(1, 'day')
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should process manual ledger request and create hold if useManualLedgerCheck equals true', async () => {
    config.useManualLedgerCheck = true

    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 120
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 120
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.schemeId = 1
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    paymentRequest.debtType = IRREGULAR
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const holds = await db.hold.findAll({
      where: {
        frn: paymentRequest.frn,
        holdCategoryId: 1,
        closed: null
      }
    })

    expect(holds.length).toBe(1)
    expect(mockSendMessage).toBeCalled()
  })

  test('should not process manual ledger request if useManualLedgerCheck equals false', async () => {
    config.useManualLedgerCheck = false

    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 120
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 120
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    paymentRequest.debtType = IRREGULAR
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const holds = await db.hold.findAll({
      where: {
        frn: paymentRequest.frn,
        holdCategoryId: 1,
        closed: null
      }
    })

    expect(holds.length).toBe(0)
    expect(mockSendMessage).not.toBeCalled()
  })

  test('should throw error with incorrect hold category', async () => {
    config.useManualLedgerCheck = true

    await db.holdCategory.update({ name: 'Incorrect category name' }, { where: { holdCategoryId: 1 } })

    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 120
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 120
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    paymentRequest.debtType = IRREGULAR
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)

    try {
      await processPaymentRequests()
    } catch (error) {
      expect(error.message).toBe('WHERE parameter "holdCategoryId" has invalid "undefined" value')
    }
  })
})
