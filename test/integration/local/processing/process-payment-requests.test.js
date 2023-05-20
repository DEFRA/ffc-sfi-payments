const { resetDatabase, closeDatabaseConnection, saveSchedule, savePaymentRequest } = require('../../../helpers')

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

const inProgressSchedule = require('../../../mocks/schedules/in-progress')

const { AP, AR } = require('../../../../app/constants/ledgers')
const { IRREGULAR } = require('../../../../app/constants/debt-types')
const { SFI } = require('../../../../app/constants/schemes')
const { Q4 } = require('../../../../app/constants/schedules')
const { PAYMENT_PAUSED_PREFIX } = require('../../../../app/constants/events')

const { processingConfig } = require('../../../../app/config')
const db = require('../../../../app/data')

const { processPaymentRequests } = require('../../../../app/processing/process-payment-requests')
const moment = require('moment')

let paymentRequest

describe('process payment requests', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    processingConfig.useManualLedgerCheck = false
    await resetDatabase()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))

    // paymentRequest = {
    //   paymentRequestId: 1,
    //   schemeId: SFI,
    //   frn: 1234567890,
    //   marketingYear: 2022,
    //   invoiceNumber: 'S12345678SIP123456V001',
    //   value: 100,
    //   paymentRequestNumber: 1,
    //   debtType: IRREGULAR
    // }

    // invoiceLine = {
    //   paymentRequestId: 1,
    //   schemeCode: '80001',
    //   fundCode: 'DRD10',
    //   agreementNumber: 'SIP123456789012',
    //   description: 'G00 - Gross value of claim',
    //   value: 100
    // }

    // schedule = {
    //   scheduleId: 1,
    //   paymentRequestId: 1,
    //   planned: moment().subtract(1, 'day')
    // }
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })

  test('should process payment request and update schedule', async () => {
    const { scheduleId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await processPaymentRequests()
    const updatedSchedule = await db.schedule.findByPk(scheduleId)
    expect(updatedSchedule.completed).not.toBeNull()
  })

  test('should process payment request and created completed request', async () => {
    const { paymentRequestId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await processPaymentRequests()
    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        paymentRequestId: paymentRequestId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId
      }
    })
    expect(completedPaymentRequests.length).toBe(1)
  })

  test('should process payment request and create completed invoice lines', async () => {
    await saveSchedule(inProgressSchedule, paymentRequest)
    await processPaymentRequests()
    const completedInvoiceLines = await db.completedInvoiceLine.findAll()
    expect(completedInvoiceLines.length).toBe(paymentRequest.invoiceLines.length)
  })

  test('should process top up request and create completed request', async () => {
    // first payment request  
    paymentRequest.value = 80
    paymentRequest.invoiceLines[0].value = 80
    paymentRequest.settled = new Date(2022, 8, 4)
    await savePaymentRequest(paymentRequest, true)

    // second payment request    
    paymentRequest.paymentRequestNumber = 2
    paymentRequest.value = 100
    paymentRequest.invoiceLines[0].value = 100
    const { paymentRequestId } = await saveSchedule(inProgressSchedule, paymentRequest)
    await processPaymentRequests()
    const completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: {
        paymentRequestId: paymentRequestId,
        frn: paymentRequest.frn,
        marketingYear: paymentRequest.marketingYear,
        schemeId: paymentRequest.schemeId,
        ledger: AP,
        value: 20
      }
    })

    expect(completedPaymentRequests.length).toBe(1)
  })

  // test('should process top up request and created completed lines', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 80
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 80
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const completedInvoiceLines = await db.completedInvoiceLine.findAll({
  //     where: {
  //       value: 20
  //     }
  //   })

  //   expect(completedInvoiceLines.length).toBe(1)
  // })

  // test('should process recovery request and create completed request', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const completedPaymentRequests = await db.completedPaymentRequest.findAll({
  //     where: {
  //       paymentRequestId: paymentRequest.paymentRequestId,
  //       frn: paymentRequest.frn,
  //       marketingYear: paymentRequest.marketingYear,
  //       schemeId: paymentRequest.schemeId,
  //       ledger: AR,
  //       value: -20
  //     }
  //   })

  //   expect(completedPaymentRequests.length).toBe(1)
  // })

  // test('should process recovery request and create completed lines', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const completedInvoiceLines = await db.completedInvoiceLine.findAll({
  //     where: {
  //       value: -20
  //     }
  //   })

  //   expect(completedInvoiceLines.length).toBe(1)
  // })

  // test('should route original request to debt queue if recovery and no debt data', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = undefined
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()

  //   const routedMessage = mockSendMessage.mock.calls[0]
  //   expect(routedMessage[0].type).toBe(`${PAYMENT_PAUSED_PREFIX}.debt`)
  //   expect(routedMessage[0].body.data.invoiceNumber).toBe(paymentRequest.invoiceNumber)
  // })

  // test('should not route original request to debt queue if recovery with debt data present', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()

  //   expect(mockSendMessage).not.toBeCalled()
  // })

  // test('should process recovery request and not create completed request if no debt data', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = undefined
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const completedPaymentRequests = await db.completedPaymentRequest.findAll({
  //     where: {
  //       paymentRequestId: paymentRequest.paymentRequestId,
  //       frn: paymentRequest.frn,
  //       marketingYear: paymentRequest.marketingYear,
  //       schemeId: paymentRequest.schemeId,
  //       ledger: AR,
  //       value: -20
  //     }
  //   })

  //   expect(completedPaymentRequests.length).toBe(0)
  // })

  // test('should process recovery request and create hold if no debt data', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = undefined
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const holds = await db.hold.findAll({
  //     where: {
  //       frn: paymentRequest.frn,
  //       holdCategoryId: 3,
  //       closed: null
  //     }
  //   })

  //   expect(holds.length).toBe(1)
  // })

  // test('should process recovery request and keep scheduled if no debt data', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = undefined
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const outstandingSchedule = await db.schedule.findAll({
  //     where: {
  //       paymentRequestId: paymentRequest.paymentRequestId,
  //       completed: null
  //     }
  //   })

  //   expect(outstandingSchedule.length).toBe(1)
  // })

  // test('should not route original request to debt queue if top up', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 80
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 80
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = undefined
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()

  //   expect(mockSendMessage).not.toBeCalled()
  // })

  // test('should process manual ledger request and create hold if useManualLedgerCheck equals true when delta value is < 0', async () => {
  //   processingConfig.useManualLedgerCheck = true

  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.schemeId = SFI
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = IRREGULAR
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const holds = await db.hold.findAll({
  //     where: {
  //       frn: paymentRequest.frn,
  //       holdCategoryId: 4,
  //       closed: null
  //     }
  //   })

  //   expect(holds.length).toBe(1)
  //   expect(mockSendMessage).toBeCalled()
  // })

  // test('should process manual ledger request and create hold if useManualLedgerCheck equals true when delta value is > 0  but there is existing completed <0 value', async () => {
  //   processingConfig.useManualLedgerCheck = true

  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.schemeId = SFI
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = -100
  //   paymentRequest.debtType = IRREGULAR
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 2
  //   paymentRequest.value = -100
  //   paymentRequest.settled = new Date(2022, 12, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = -100
  //   invoiceLine.completedPaymentRequestId = 2
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // Third payment request
  //   paymentRequest.schemeId = SFI
  //   paymentRequest.paymentRequestId = 3
  //   paymentRequest.paymentRequestNumber = 3
  //   paymentRequest.value = 300
  //   paymentRequest.debtType = IRREGULAR
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 3
  //   invoiceLine.value = 300
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 3
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const holds = await db.hold.findAll({
  //     where: {
  //       frn: paymentRequest.frn,
  //       holdCategoryId: 4,
  //       closed: null
  //     }
  //   })

  //   expect(holds.length).toBe(1)
  //   expect(mockSendMessage).toBeCalled()
  // })

  // test('should process manual ledger request and create hold if useManualLedgerCheck equals true when delta value is > 0, there is existing completed payment but no existing completed payment value < 0 ', async () => {
  //   processingConfig.useManualLedgerCheck = true

  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.schemeId = SFI
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 200
  //   paymentRequest.debtType = IRREGULAR
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 2
  //   paymentRequest.value = 200
  //   paymentRequest.settled = new Date(2022, 12, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 200
  //   invoiceLine.completedPaymentRequestId = 2
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // Third payment request
  //   paymentRequest.schemeId = SFI
  //   paymentRequest.paymentRequestId = 3
  //   paymentRequest.paymentRequestNumber = 3
  //   paymentRequest.value = 500
  //   paymentRequest.debtType = IRREGULAR
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 3
  //   invoiceLine.value = 500
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 3
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const holds = await db.hold.findAll({
  //     where: {
  //       frn: paymentRequest.frn,
  //       holdCategoryId: 4,
  //       closed: null
  //     }
  //   })

  //   expect(holds.length).toBe(0)
  //   expect(mockSendMessage).not.toBeCalled()
  // })

  // test('should not process manual ledger request if useManualLedgerCheck equals false', async () => {
  //   processingConfig.useManualLedgerCheck = false

  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = IRREGULAR
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()
  //   const holds = await db.hold.findAll({
  //     where: {
  //       frn: paymentRequest.frn,
  //       holdCategoryId: 4,
  //       closed: null
  //     }
  //   })

  //   expect(holds.length).toBe(0)
  //   expect(mockSendMessage).not.toBeCalled()
  // })

  // test('should throw error with incorrect hold category', async () => {
  //   processingConfig.useManualLedgerCheck = true

  //   await db.holdCategory.update({ name: 'Incorrect category name' }, { where: { holdCategoryId: 2 } })

  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 120
  //   paymentRequest.settled = new Date(2022, 8, 4)
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 120
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 100
  //   paymentRequest.debtType = IRREGULAR
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 100
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)

  //   try {
  //     await processPaymentRequests()
  //   } catch (error) {
  //     expect(error.message).toBe('WHERE parameter "holdCategoryId" has invalid "undefined" value')
  //   }
  // })

  // test('should calculate recovery with multiple lines', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.schedule = Q4
  //   paymentRequest.dueDate = '09/11/2020'
  //   paymentRequest.ledger = AP
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 1988697
  //   paymentRequest.lastSettlement = new Date(2021, 8, 4)
  //   paymentRequest.settledValue = 994348
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 347910
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 695820
  //   invoiceLine.schemeCode = '80002'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 287532
  //   invoiceLine.schemeCode = '80004'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 99267
  //   invoiceLine.schemeCode = '80005'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 58168
  //   invoiceLine.schemeCode = '80006'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 50000
  //   invoiceLine.schemeCode = '80009'
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 889759
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 347910
  //   invoiceLine.schemeCode = '80001'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 695820
  //   invoiceLine.schemeCode = '80002'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 287532
  //   invoiceLine.schemeCode = '80004'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 99267
  //   invoiceLine.schemeCode = '80005'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 58168
  //   invoiceLine.schemeCode = '80006'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 50000
  //   invoiceLine.schemeCode = '80009'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -347910
  //   invoiceLine.schemeCode = '80001'
  //   invoiceLine.description = 'P24 - Over declaration reduction'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -695820
  //   invoiceLine.schemeCode = '80002'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -26880
  //   invoiceLine.schemeCode = '80004'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -18328
  //   invoiceLine.schemeCode = '80005'
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()

  //   const completedPaymentRequestAP = await db.completedPaymentRequest.findOne({ where: { paymentRequestId: 2, ledger: AP } })
  //   const completedPaymentRequestAR = await db.completedPaymentRequest.findOne({ where: { paymentRequestId: 2, ledger: AR } })
  //   const completedInvoiceLinesAP = await db.completedInvoiceLine.findAll({ where: { completedPaymentRequestId: completedPaymentRequestAP.completedPaymentRequestId } })
  //   const completedInvoiceLinesAR = await db.completedInvoiceLine.findAll({ where: { completedPaymentRequestId: completedPaymentRequestAR.completedPaymentRequestId } })
  //   const totalAP = completedInvoiceLinesAP.reduce((x, y) => x + y.value, 0)
  //   const totalAR = completedInvoiceLinesAR.reduce((x, y) => x + y.value, 0)
  //   expect(completedPaymentRequestAP.value).toBe(-994349)
  //   expect(completedPaymentRequestAR.value).toBe(-94589)
  //   expect(totalAP).toBe(-994349)
  //   expect(totalAR).toBe(-94589)
  // })

  // test('should calculate top up with multiple lines', async () => {
  //   // first payment request
  //   await db.paymentRequest.create(paymentRequest)
  //   paymentRequest.schedule = Q4
  //   paymentRequest.dueDate = '09/11/2020'
  //   paymentRequest.ledger = AP
  //   paymentRequest.completedPaymentRequestId = 1
  //   paymentRequest.value = 1988697
  //   paymentRequest.lastSettlement = new Date(2021, 8, 4)
  //   paymentRequest.settledValue = 994348
  //   await db.completedPaymentRequest.create(paymentRequest)
  //   invoiceLine.value = 347910
  //   invoiceLine.completedPaymentRequestId = 1
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 695820
  //   invoiceLine.schemeCode = '80002'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 287532
  //   invoiceLine.schemeCode = '80004'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 99267
  //   invoiceLine.schemeCode = '80005'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 58168
  //   invoiceLine.schemeCode = '80006'
  //   await db.completedInvoiceLine.create(invoiceLine)
  //   invoiceLine.value = 50000
  //   invoiceLine.schemeCode = '80009'
  //   await db.completedInvoiceLine.create(invoiceLine)

  //   // second payment request
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   paymentRequest.value = 889759
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 2
  //   invoiceLine.value = 347910
  //   invoiceLine.schemeCode = '80001'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 695820
  //   invoiceLine.schemeCode = '80002'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 287532
  //   invoiceLine.schemeCode = '80004'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 99267
  //   invoiceLine.schemeCode = '80005'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 58168
  //   invoiceLine.schemeCode = '80006'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 50000
  //   invoiceLine.schemeCode = '80009'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -347910
  //   invoiceLine.schemeCode = '80001'
  //   invoiceLine.description = 'P24 - Over declaration reduction'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -695820
  //   invoiceLine.schemeCode = '80002'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -26880
  //   invoiceLine.schemeCode = '80004'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = -18328
  //   invoiceLine.schemeCode = '80005'
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()

  //   // third payment request
  //   paymentRequest.paymentRequestId = 3
  //   paymentRequest.paymentRequestNumber = 3
  //   paymentRequest.value = 889759
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.paymentRequestId = 3
  //   invoiceLine.value = 347910
  //   invoiceLine.schemeCode = '80001'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 695820
  //   invoiceLine.schemeCode = '80002'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 287532
  //   invoiceLine.schemeCode = '80004'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 99267
  //   invoiceLine.schemeCode = '80005'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 58168
  //   invoiceLine.schemeCode = '80006'
  //   await db.invoiceLine.create(invoiceLine)
  //   invoiceLine.value = 50000
  //   invoiceLine.schemeCode = '80009'
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.paymentRequestId = 3
  //   schedule.scheduleId = 2
  //   await db.schedule.create(schedule)
  //   await processPaymentRequests()

  //   const completedPaymentRequestAP = await db.completedPaymentRequest.findOne({ where: { paymentRequestId: 3, ledger: AP } })
  //   const completedPaymentRequestAR = await db.completedPaymentRequest.findOne({ where: { paymentRequestId: 3, ledger: AR } })
  //   const completedInvoiceLinesAP = await db.completedInvoiceLine.findAll({ where: { completedPaymentRequestId: completedPaymentRequestAP.completedPaymentRequestId } })
  //   const completedInvoiceLinesAR = await db.completedInvoiceLine.findAll({ where: { completedPaymentRequestId: completedPaymentRequestAR.completedPaymentRequestId } })
  //   const totalAP = completedInvoiceLinesAP.reduce((x, y) => x + y.value, 0)
  //   const totalAR = completedInvoiceLinesAR.reduce((x, y) => x + y.value, 0)
  //   expect(completedPaymentRequestAP.value).toBe(994349)
  //   expect(completedPaymentRequestAR.value).toBe(94589)
  //   expect(totalAP).toBe(994349)
  //   expect(totalAR).toBe(94589)
  // })
})
