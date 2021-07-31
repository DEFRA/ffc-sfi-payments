const db = require('../../../../app/data')
const getPaymentRequests = require('../../../../app/processing/get-payment-requests')
const config = require('../../../../app/config')
const moment = require('moment')
let scheme
let paymentRequest
let schedule
let invoiceLine
let holdCategory
let hold

describe('get payment requests', () => {
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
      marketingYear: 2022
    }

    paymentRequest = {
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022
    }

    invoiceLine = {
      invoiceLineId: 1,
      paymentRequestId: 1
    }

    schedule = {
      scheduleId: 1,
      paymentRequestId: 1,
      planned: moment().subtract(1, 'day')
    }

    holdCategory = {
      holdCategoryId: 1,
      schemeId: 1,
      name: 'Hold'
    }

    hold = {
      holdId: 1,
      holdCategoryId: 1,
      frn: 1234567890,
      added: moment().subtract(1, 'day')
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should not return any payment requests if no data', async () => {
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return any payment requests if no requests for scheme', async () => {
    await db.scheme.create(scheme)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return any payment requests if none scheduled', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return any payment requests if none due', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    schedule.planned = moment().add(1, 'day')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if due', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return payment request if no invoice lines', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return payment request if scheme inactive', async () => {
    scheme.active = false
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return payment request if already in progress', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    schedule.started = moment().subtract(1, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if process time exceeded', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    schedule.started = moment().subtract(10, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return payment request if complete', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    schedule.completed = moment().subtract(1, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return payment request if another for same agreement in process', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    await db.paymentRequest.create(paymentRequest)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.started = moment().subtract(1, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if another for same agreement in process but time expired', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    await db.paymentRequest.create(paymentRequest)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.started = moment().subtract(10, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return payment request if another for same agreement in process but time expired if scheme inactive', async () => {
    scheme.active = false
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    await db.paymentRequest.create(paymentRequest)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.started = moment().subtract(10, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if another for same agreement completed', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    await db.paymentRequest.create(paymentRequest)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.completed = moment().subtract(10, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if another for same customer in process but different scheme', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    scheme.schemeId = 2
    await db.scheme.create(scheme)
    paymentRequest.paymentRequestId = 2
    paymentRequest.schemeId = 2
    await db.paymentRequest.create(paymentRequest)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.started = moment().subtract(1, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if another for same customer in process but different marketing year', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    paymentRequest.marketingYear = 2021
    await db.paymentRequest.create(paymentRequest)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.started = moment().subtract(1, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if another for different customer in process', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    paymentRequest.frn = 1234567891
    await db.paymentRequest.create(paymentRequest)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.started = moment().subtract(1, 'minute')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if scheme has hold category with no holds', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await db.holdCategory.create(holdCategory)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return payment request if frn on hold', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if hold expired', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await db.holdCategory.create(holdCategory)
    hold.closed = new Date()
    await db.hold.create(hold)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if hold for different customer', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await db.holdCategory.create(holdCategory)
    hold.frn = 234567891
    await db.hold.create(hold)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if hold for different scheme', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    scheme.schemeId = 2
    await db.scheme.create(scheme)
    holdCategory.schemeId = 2
    await db.holdCategory.create(holdCategory)
    await db.hold.create(hold)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should remove duplicate payment request if another for same agreement pending', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.invoiceLineId = 2
    invoiceLine.paymentRequestId = 2
    await db.invoiceLine.create(invoiceLine)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return first scheduled if payment request if another for same agreement pending', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.invoiceLineId = 2
    invoiceLine.paymentRequestId = 2
    await db.invoiceLine.create(invoiceLine)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    schedule.planned = moment().subtract(2, 'day')
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
    expect(paymentRequests[0].scheduleId).toBe(2)
  })

  test('should not remove pending for same customer but different marketing year as duplicate', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    paymentRequest.marketingYear = 2021
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.invoiceLineId = 2
    invoiceLine.paymentRequestId = 2
    await db.invoiceLine.create(invoiceLine)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(2)
  })

  test('should not remove pending for different customer as duplicate', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    paymentRequest.frn = 1234567891
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.invoiceLineId = 2
    invoiceLine.paymentRequestId = 2
    await db.invoiceLine.create(invoiceLine)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(2)
  })

  test('should not remove pending for same customer but different scheme as duplicate', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    scheme.schemeId = 2
    await db.scheme.create(scheme)
    paymentRequest.paymentRequestId = 2
    paymentRequest.schemeId = 2
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.invoiceLineId = 2
    invoiceLine.paymentRequestId = 2
    await db.invoiceLine.create(invoiceLine)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(2)
  })

  test('process batch is capped at maximum', async () => {
    config.processingBatchSize = 10
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)

    for (let i = 2; i < 13; i++) {
      paymentRequest.paymentRequestId = i
      paymentRequest.frn = 1234567890 + i
      await db.paymentRequest.create(paymentRequest)
      invoiceLine.invoiceLineId = i
      invoiceLine.paymentRequestId = i
      await db.invoiceLine.create(invoiceLine)
      schedule.scheduleId = i
      schedule.paymentRequestId = i
      await db.schedule.create(schedule)
    }

    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(10)
  })

  test('process batch includes earliest when capped', async () => {
    config.processingBatchSize = 5
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)

    const earlierDate = moment().subtract(2, 'day')

    for (let i = 2; i < 13; i++) {
      paymentRequest.paymentRequestId = i
      paymentRequest.frn = 1234567890 + i
      await db.paymentRequest.create(paymentRequest)
      invoiceLine.invoiceLineId = i
      invoiceLine.paymentRequestId = i
      await db.invoiceLine.create(invoiceLine)
      schedule.scheduleId = i
      schedule.paymentRequestId = i
      if (i % 2 === 0) {
        schedule.planned = earlierDate
      }
      await db.schedule.create(schedule)
    }

    const paymentRequests = await getPaymentRequests()
    for (const paymentRequest of paymentRequests) {
      expect(paymentRequest.planned).toStrictEqual(earlierDate.toDate())
    }
  })

  test('should update as processing started if payment request if due', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    await getPaymentRequests()
    const updatedSchedule = await db.schedule.findByPk(schedule.scheduleId)
    expect(updatedSchedule.started).not.toBeNull()
  })

  test('should update only valid if duplicate payment request if another for same agreement pending', async () => {
    await db.scheme.create(scheme)
    await db.paymentRequest.create(paymentRequest)
    await db.invoiceLine.create(invoiceLine)
    await db.schedule.create(schedule)
    paymentRequest.paymentRequestId = 2
    await db.paymentRequest.create(paymentRequest)
    invoiceLine.invoiceLineId = 2
    invoiceLine.paymentRequestId = 2
    await db.invoiceLine.create(invoiceLine)
    schedule.scheduleId = 2
    schedule.paymentRequestId = 2
    await db.schedule.create(schedule)
    await getPaymentRequests()
    const updatedSchedule = await db.schedule.findByPk(1)
    const notToBeUpdatedSchedule = await db.schedule.findByPk(2)
    expect(updatedSchedule.started).not.toBeNull()
    expect(notToBeUpdatedSchedule.started).toBeNull()
  })
})
