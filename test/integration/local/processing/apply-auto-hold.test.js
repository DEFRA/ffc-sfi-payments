jest.mock('../../../../app/config', () => ({
  ...jest.requireActual('../../../../app/config'),
  autoHold: {
    topUp: true,
    recovery: true
  }
}))
const db = require('../../../../app/data')
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

describe('process payment requests', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })

    await db.scheme.create({
      schemeId: 1,
      name: 'SFI'
    })

    await db.accountCode.create({
      accountCodeId: 1,
      schemeId: 1,
      lineDescription: 'G00 - Gross value of claim',
      accountCodeAP: 'SOS273',
      accountCodeARIrr: 'SOS274',
      accountCodeARAdm: 'SOS275'
    })

    await db.holdCategory.bulkCreate([{
      holdCategoryId: 2,
      schemeId: 1,
      name: 'Recovery'
    }, {
      holdCategoryId: 3,
      schemeId: 1,
      name: 'Top up'
    }])

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

  test('should create hold if recovery and recovery set to auto hold', async () => {
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
        holdCategoryId: 2,
        closed: null
      }
    })

    expect(holds.length).toBe(1)
  })

  test('should create hold if top up and top up set to auto hold', async () => {
    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 80
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 80
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
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
        holdCategoryId: 3,
        closed: null
      }
    })

    expect(holds.length).toBe(1)
  })

  test('should not create completed if recovery and recovery set to auto hold', async () => {
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
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        paymentRequestId: paymentRequest.paymentRequestId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId
      }
    })

    expect(completedPaymentRequests.length).toBe(0)
  })

  test('should not create completed if top up and top up set to auto hold', async () => {
    // first payment request
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 1
    paymentRequest.value = 80
    paymentRequest.settled = new Date(2022, 8, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = 80
    invoiceLine.completedPaymentRequestId = 1
    await db.completedInvoiceLine.create(invoiceLine)

    // second payment request
    paymentRequest.paymentRequestId = 2
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()

    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        paymentRequestId: paymentRequest.paymentRequestId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId
      }
    })

    expect(completedPaymentRequests.length).toBe(0)
  })

  test('first payments ignored by auto hold', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await processPaymentRequests()

    const holds = await db.hold.findAll()
    expect(holds.length).toBe(0)
  })
})
