const db = require('../../../../app/data')
const config = require('../../../../app/config')
const processPaymentRequests = require('../../../../app/processing/process-payment-requests')
const moment = require('moment')
const { AP, AR } = require('../../../../app/ledgers')
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
    config.useManualLedgerCheck = false
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
      name: 'Awaiting debt enrichment'
    })

    await db.holdCategory.create({
      holdCategoryId: 2,
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

  test('should process payment request and update schedule', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const updatedSchedule = await db.schedule.findByPk(schedule.scheduleId)
    expect(updatedSchedule.completed).not.toBeNull()
  })

  test('should process payment request and created completed request', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
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
    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should process payment request and create completed invoice lines', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        description: invoiceLine.description
      }
    })
    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should process top up request and created completed request', async () => {
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
        schemeId: paymentRequest.schemeId,
        ledger: AP,
        value: 20
      }
    })

    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should process top up request and created completed lines', async () => {
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
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        value: 20
      }
    })

    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should process recovery request and create completed request', async () => {
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
        schemeId: paymentRequest.schemeId,
        ledger: AR,
        value: -20
      }
    })

    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should process recovery request and create completed lines', async () => {
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
    const completedInvoiceLines = await db.completedInvoiceLine.findAll({
      where: {
        value: -20
      }
    })

    expect(completedInvoiceLines.length).toBe(1)
  })

  test('should route original request to debt queue if recovery and no debt data', async () => {
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
    paymentRequest.debtType = undefined
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()

    expect(mockSendMessage.mock.calls.length).toBe(1)
    expect(mockSendMessage.mock.calls[0][0].body.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  })

  test('should not route original request to debt queue if recovery with debt data present', async () => {
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

    expect(mockSendMessage).not.toBeCalled()
  })

  test('should process recovery request and not create completed request if no debt data', async () => {
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
    paymentRequest.debtType = undefined
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
        schemeId: paymentRequest.schemeId,
        ledger: AR,
        value: -20
      }
    })

    expect(completedPaymentRequests.length).toBe(0)
  })

  test('should process recovery request and create hold if no debt data', async () => {
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
    paymentRequest.debtType = undefined
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
  })

  test('should process recovery request and keep scheduled if no debt data', async () => {
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
    paymentRequest.debtType = undefined
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()
    const outstandingSchedule = await db.schedule.findAll({
      where: {
        paymentRequestId: paymentRequest.paymentRequestId,
        completed: null
      }
    })

    expect(outstandingSchedule.length).toBe(1)
  })

  test('should not route original request to debt queue if top up', async () => {
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
    paymentRequest.debtType = undefined
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 2
    invoiceLine.value = 100
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await processPaymentRequests()

    expect(mockSendMessage).not.toBeCalled()
  })

  test('should process manual ledger request and create hold if useManualLedgerCheck equals true when delta value is < 0', async () => {
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
        holdCategoryId: 2,
        closed: null
      }
    })

    expect(holds.length).toBe(1)
    expect(mockSendMessage).toBeCalled()
  })

  test('should process manual ledger request and create hold if useManualLedgerCheck equals true when delta value is > 0  but there is existing completed <0 value', async () => {
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
    paymentRequest.value = -100
    paymentRequest.debtType = IRREGULAR
    await db.paymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 2
    paymentRequest.value = -100
    paymentRequest.settled = new Date(2022, 12, 4)
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.value = -100
    invoiceLine.completedPaymentRequestId = 2
    await db.completedInvoiceLine.create(invoiceLine)

    // Third payment request
    paymentRequest.schemeId = 1
    paymentRequest.paymentRequestId = 3
    paymentRequest.paymentRequestNumber = 3
    paymentRequest.value = 300
    paymentRequest.debtType = IRREGULAR
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.paymentRequestId = 3
    invoiceLine.value = 300
    await db.invoiceLine.create(invoiceLine)
    schedule.paymentRequestId = 3
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
        holdCategoryId: 2,
        closed: null
      }
    })

    expect(holds.length).toBe(0)
    expect(mockSendMessage).not.toBeCalled()
  })

  test('should throw error with incorrect hold category', async () => {
    config.useManualLedgerCheck = true

    await db.holdCategory.update({ name: 'Incorrect category name' }, { where: { holdCategoryId: 2 } })

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
