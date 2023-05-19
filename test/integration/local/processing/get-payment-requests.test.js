const moment = require('moment')

const { resetDatabase, closeDatabaseConnection, saveSchedule, savePaymentRequest } = require('../../../helpers')

const { FRN } = require('../../../mocks/values/frn')
const newSchedule = require('../../../mocks/schedules/new')
const futureSchedule = require('../../../mocks/schedules/future')
const completedSchedule = require('../../../mocks/schedules/completed')

const { SFI_PILOT, SFI } = require('../../../../app/constants/schemes')

const db = require('../../../../app/data')
const { getPaymentRequests } = require('../../../../app/processing/scheduled/get-payment-requests')
const { processingConfig } = require('../../../../app/config')

let paymentRequest
let schedule
let invoiceLine
let holdCategory
let hold

describe('get payment requests', () => {
  beforeEach(async () => {
    await resetDatabase()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))

    hold = {
      holdCategoryId: 1,
      frn: FRN,
      added: moment().subtract(1, 'day')
    }
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })

  test('should not return any payment requests if no data', async () => {
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return any payment requests if no requests for scheme', async () => {
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return any payment requests if none scheduled', async () => {
    await savePaymentRequest(paymentRequest)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return any payment requests if none due', async () => {
    await saveSchedule(futureSchedule, paymentRequest)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if due', async () => {
    await saveSchedule(newSchedule, paymentRequest)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return payment request if no invoice lines', async () => {
    const { paymentRequestId } = await saveSchedule(newSchedule, paymentRequest)
    await db.invoiceLine.destroy({ where: { paymentRequestId } })
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return payment request if scheme inactive', async () => {
    await db.scheme.update({ active: false }, { where: { schemeId: SFI } })
    await saveSchedule(newSchedule, paymentRequest)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return payment request if already in progress', async () => {
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(1, 'minute') }, { where: { scheduleId } })
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if process time exceeded', async () => {
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(10, 'minute') }, { where: { scheduleId } })
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return payment request if complete', async () => {
    await saveSchedule(completedSchedule, paymentRequest)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should not return payment request if another for same agreement in process', async () => {
    await saveSchedule(newSchedule, paymentRequest)
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(1, 'minute') }, { where: { scheduleId } })
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if another for same agreement in process but time expired', async () => {
    await saveSchedule(newSchedule, paymentRequest)
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(10, 'minute') }, { where: { scheduleId } })
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should not return payment request if another for same agreement in process but time expired if scheme inactive', async () => {
    await db.scheme.update({ active: false }, { where: { schemeId: SFI } })
    await saveSchedule(newSchedule, paymentRequest)
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(10, 'minute') }, { where: { scheduleId } })
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(0)
  })

  test('should return payment request if another for same agreement completed', async () => {
    await saveSchedule(newSchedule, paymentRequest)
    await saveSchedule(completedSchedule, paymentRequest)
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if another for same customer in process but different scheme', async () => {
    await saveSchedule(newSchedule, paymentRequest)
    paymentRequest.schemeId = SFI_PILOT
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(1, 'minute') }, { where: { scheduleId } })
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if another for same customer in process but different marketing year', async () => {
    await saveSchedule(newSchedule, paymentRequest)
    paymentRequest.marketingYear = 2021
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(1, 'minute') }, { where: { scheduleId } })
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  test('should return payment request if another for different customer in process', async () => {
    await saveSchedule(newSchedule, paymentRequest)
    paymentRequest.frn = 1234567891
    const { scheduleId } = await saveSchedule(newSchedule, paymentRequest)
    await db.schedule.update({ started: moment().subtract(1, 'minute') }, { where: { scheduleId } })
    await db.schedule.create(schedule)
    const paymentRequests = await getPaymentRequests()
    expect(paymentRequests.length).toBe(1)
  })

  // test('should return payment request if scheme has hold category with no holds', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   await db.holdCategory.create(holdCategory)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(1)
  // })

  // test('should not return payment request if frn on hold', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   await db.holdCategory.create(holdCategory)
  //   await db.hold.create(hold)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(0)
  // })

  // test('should return payment request if hold expired', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   await db.holdCategory.create(holdCategory)
  //   hold.closed = new Date()
  //   await db.hold.create(hold)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(1)
  // })

  // test('should return payment request if hold for different customer', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   await db.holdCategory.create(holdCategory)
  //   hold.frn = 234567891
  //   await db.hold.create(hold)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(1)
  // })

  // test('should return payment request if hold for different scheme', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)

  //   holdCategory.schemeId = SFI_PILOT
  //   await db.holdCategory.create(holdCategory)
  //   await db.hold.create(hold)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(1)
  // })

  // test('should remove duplicate payment request if another for same agreement pending', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   paymentRequest.paymentRequestId = 2
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.invoiceLineId = 2
  //   invoiceLine.paymentRequestId = 2
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.scheduleId = 2
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(1)
  // })

  // test('should return first request if payment request if another for same agreement pending even if scheduled earlier', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.paymentRequestNumber = 2
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.invoiceLineId = 2
  //   invoiceLine.paymentRequestId = 2
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.scheduleId = 2
  //   schedule.paymentRequestId = 2
  //   schedule.planned = moment().subtract(2, 'day')
  //   await db.schedule.create(schedule)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(1)
  //   expect(paymentRequests[0].scheduleId).toBe(1)
  //   expect(paymentRequests[0].paymentRequest.paymentRequestNumber).toBe(1)
  // })

  // test('should not remove pending for same customer but different marketing year as duplicate', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.marketingYear = 2021
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.invoiceLineId = 2
  //   invoiceLine.paymentRequestId = 2
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.scheduleId = 2
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(2)
  // })

  // test('should not remove pending for different customer as duplicate', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.frn = 1234567891
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.invoiceLineId = 2
  //   invoiceLine.paymentRequestId = 2
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.scheduleId = 2
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(2)
  // })

  // test('should not remove pending for same customer but different scheme as duplicate', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)

  //   paymentRequest.paymentRequestId = 2
  //   paymentRequest.schemeId = SFI_PILOT
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.invoiceLineId = 2
  //   invoiceLine.paymentRequestId = 2
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.scheduleId = 2
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(2)
  // })

  // test('process batch is capped at maximum', async () => {
  //   processingConfig.processingCap = 10

  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)

  //   for (let i = 2; i < 13; i++) {
  //     paymentRequest.paymentRequestId = i
  //     paymentRequest.frn = 1234567890 + i
  //     await db.paymentRequest.create(paymentRequest)
  //     invoiceLine.invoiceLineId = i
  //     invoiceLine.paymentRequestId = i
  //     await db.invoiceLine.create(invoiceLine)
  //     schedule.scheduleId = i
  //     schedule.paymentRequestId = i
  //     await db.schedule.create(schedule)
  //   }

  //   const paymentRequests = await getPaymentRequests()
  //   expect(paymentRequests.length).toBe(10)
  // })

  // test('process batch includes earliest when capped', async () => {
  //   processingConfig.processingCap = 5

  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)

  //   const earlierDate = moment().subtract(2, 'day')

  //   for (let i = 2; i < 13; i++) {
  //     paymentRequest.paymentRequestId = i
  //     paymentRequest.frn = 1234567890 + i
  //     await db.paymentRequest.create(paymentRequest)
  //     invoiceLine.invoiceLineId = i
  //     invoiceLine.paymentRequestId = i
  //     await db.invoiceLine.create(invoiceLine)
  //     schedule.scheduleId = i
  //     schedule.paymentRequestId = i
  //     if (i % 2 === 0) {
  //       schedule.planned = earlierDate
  //     }
  //     await db.schedule.create(schedule)
  //   }

  //   const paymentRequests = await getPaymentRequests()
  //   for (const request of paymentRequests) {
  //     expect(request.planned).toStrictEqual(earlierDate.toDate())
  //   }
  // })

  // test('should update as processing started if payment request if due', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   await getPaymentRequests()
  //   const updatedSchedule = await db.schedule.findByPk(schedule.scheduleId)
  //   expect(updatedSchedule.started).not.toBeNull()
  // })

  // test('should update only valid if duplicate payment request if another for same agreement pending', async () => {
  //   await db.paymentRequest.create(paymentRequest)
  //   await db.invoiceLine.create(invoiceLine)
  //   await db.schedule.create(schedule)
  //   paymentRequest.paymentRequestId = 2
  //   await db.paymentRequest.create(paymentRequest)
  //   invoiceLine.invoiceLineId = 2
  //   invoiceLine.paymentRequestId = 2
  //   await db.invoiceLine.create(invoiceLine)
  //   schedule.scheduleId = 2
  //   schedule.paymentRequestId = 2
  //   await db.schedule.create(schedule)
  //   await getPaymentRequests()
  //   const updatedSchedule = await db.schedule.findByPk(1)
  //   const notToBeUpdatedSchedule = await db.schedule.findByPk(2)
  //   expect(updatedSchedule.started).not.toBeNull()
  //   expect(notToBeUpdatedSchedule.started).toBeNull()
  // })
})
