const db = require('../../../app/data')
const updateAcknowledgement = require('../../../app/acknowledgement')
const { v4: uuidv4 } = require('uuid')
let scheme
let holdCategoryBank
let holdCategoryDax
let paymentRequest
let acknowledgement

describe('acknowledge payment request', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    holdCategoryBank = {
      holdCategoryId: 1,
      schemeId: 1,
      name: 'Bank account anomaly'
    }

    holdCategoryDax = {
      holdCategoryId: 2,
      schemeId: 1,
      name: 'DAX rejection'
    }

    paymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      invoiceNumber: 'S12345678A123456V001',
      referenceId: uuidv4()
    }

    acknowledgement = {
      invoiceNumber: 'S12345678A123456V001',
      acknowledged: new Date(2021, 8, 2),
      success: true
    }

    await db.scheme.create(scheme)
    await db.holdCategory.create(holdCategoryBank)
    await db.holdCategory.create(holdCategoryDax)
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should add acknowledged date if success', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await updateAcknowledgement(acknowledgement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(paymentRequest.paymentRequestId)
    expect(updatedPaymentRequest.acknowledged).toStrictEqual(new Date(2021, 8, 2))
  })

  test('should add acknowledged date to failure', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(paymentRequest.completedPaymentRequestId)
    expect(updatedPaymentRequest.acknowledged).toStrictEqual(new Date(2021, 8, 2))
  })

  test('should invalidate payment request on failure', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findByPk(paymentRequest.completedPaymentRequestId)
    expect(updatedPaymentRequest.invalid).toBeTruthy()
  })

  test('should invalidate all payment requests on failure', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    paymentRequest.completedPaymentRequestId = 2
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const updatedPaymentRequests = await db.completedPaymentRequest.findAll({ where: { invalid: true } })
    expect(updatedPaymentRequests.length).toBe(2)
  })

  test('should create DAX rejection hold on failure if no message', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const holds = await db.hold.findAll({ where: { holdCategoryId: 2, frn: paymentRequest.frn } })
    expect(holds.length).toBe(1)
  })

  test('should create DAX rejection hold on failure if message', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    acknowledgement.message = 'Fail'
    await updateAcknowledgement(acknowledgement)
    const holds = await db.hold.findAll({ where: { holdCategoryId: 2, frn: paymentRequest.frn } })
    expect(holds.length).toBe(1)
  })

  test('should create Invalid bank details hold on failure if Invalid bank details message', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    acknowledgement.message = 'Invalid bank details'
    await updateAcknowledgement(acknowledgement)
    const holds = await db.hold.findAll({ where: { holdCategoryId: 1, frn: paymentRequest.frn } })
    expect(holds.length).toBe(1)
  })

  test('should not create DAX rejection hold on failure if open hold exists', async () => {
    const hold = {
      holdCategoryId: 2,
      frn: paymentRequest.frn,
      created: new Date()
    }
    await db.hold.create(hold)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const holds = await db.hold.findAll({ where: { holdCategoryId: 2, frn: paymentRequest.frn } })
    expect(holds.length).toBe(1)
  })

  test('should create DAX rejection hold on failure if closed hold exists', async () => {
    const hold = {
      holdCategoryId: 2,
      frn: paymentRequest.frn,
      created: new Date(),
      closed: new Date()
    }
    await db.hold.create(hold)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const holds = await db.hold.findAll({ where: { holdCategoryId: 2, frn: paymentRequest.frn } })
    expect(holds.length).toBe(2)
    expect(holds.filter(x => x.closed === null).length).toBe(1)
  })

  test('should not create Invalid bank details hold on failure if open hold exists', async () => {
    const hold = {
      holdCategoryId: 1,
      frn: paymentRequest.frn,
      created: new Date()
    }
    await db.hold.create(hold)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    acknowledgement.message = 'Invalid bank details'
    await updateAcknowledgement(acknowledgement)
    const holds = await db.hold.findAll({ where: { holdCategoryId: 1, frn: paymentRequest.frn } })
    expect(holds.length).toBe(1)
  })

  test('should create Invalid bank details hold on failure if closed hold exists', async () => {
    const hold = {
      holdCategoryId: 1,
      frn: paymentRequest.frn,
      created: new Date(),
      closed: new Date()
    }
    await db.hold.create(hold)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    acknowledgement.message = 'Invalid bank details'
    await updateAcknowledgement(acknowledgement)
    const holds = await db.hold.findAll({ where: { holdCategoryId: 1, frn: paymentRequest.frn } })
    expect(holds.length).toBe(2)
    expect(holds.filter(x => x.closed === null).length).toBe(1)
  })

  test('should reschedule failure', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const schedules = await db.schedule.findAll({ where: { paymentRequestId: paymentRequest.paymentRequestId, planned: { [db.Sequelize.Op.ne]: null }, completed: null } })
    expect(schedules.length).toBe(1)
  })

  test('should not reschedule failure if already scheduled', async () => {
    const schedule = {
      paymentRequestId: paymentRequest.paymentRequestId,
      planned: new Date()
    }
    await db.paymentRequest.create(paymentRequest)
    await db.schedule.create(schedule)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const schedules = await db.schedule.findAll({ where: { paymentRequestId: paymentRequest.paymentRequestId, planned: { [db.Sequelize.Op.ne]: null }, completed: null } })
    expect(schedules.length).toBe(1)
  })

  test('should reschedule failure if all scheduled complete', async () => {
    const schedule = {
      paymentRequestId: paymentRequest.paymentRequestId,
      planned: new Date(),
      completed: new Date()
    }
    await db.paymentRequest.create(paymentRequest)
    await db.schedule.create(schedule)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const schedules = await db.schedule.findAll({ where: { paymentRequestId: paymentRequest.paymentRequestId } })
    expect(schedules.length).toBe(2)
    expect(schedules.filter(x => x.completed === null).length).toBe(1)
  })

  test('should create new referenceId on failure', async () => {
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    acknowledgement.success = false
    await updateAcknowledgement(acknowledgement)
    const updatedPaymentRequest = await db.paymentRequest.findByPk(paymentRequest.paymentRequestId)
    expect(updatedPaymentRequest.referenceId).not.toBe(paymentRequest.referenceId)
    expect(updatedPaymentRequest.referenceId).toMatch(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)
  })
})
