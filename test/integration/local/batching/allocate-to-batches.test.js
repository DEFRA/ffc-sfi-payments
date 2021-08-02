const allocateToBatch = require('../../../../app/batching/allocate-to-batches')
const db = require('../../../../app/data')
let scheme
let paymentRequest
let invoiceLine
let sequence

describe('allocate to batch', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    paymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      ledger: 'AP'
    }

    invoiceLine = {
      invoiceLineId: 1,
      completedPaymentRequestId: 1
    }

    sequence = {
      schemeId: 1,
      nextAP: 5,
      nextAR: 3
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should not increase sequence if no due payment requests', async () => {
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await allocateToBatch()
    const sequenceResult = await db.sequence.findByPk(sequence.schemeId)
    expect(sequenceResult.nextAP).toBe(5)
    expect(sequenceResult.nextAR).toBe(3)
  })

  test('should not increase sequence for AP payment requests with no invoice lines', async () => {
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await allocateToBatch()
    const sequenceResult = await db.sequence.findByPk(sequence.schemeId)
    expect(sequenceResult.nextAP).toBe(5)
    expect(sequenceResult.nextAR).toBe(3)
  })

  test('should not increase sequence for AR payment requests with no invoice lines', async () => {
    paymentRequest.ledger = 'AR'
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await allocateToBatch()
    const sequenceResult = await db.sequence.findByPk(sequence.schemeId)
    expect(sequenceResult.nextAP).toBe(5)
    expect(sequenceResult.nextAR).toBe(3)
  })

  test('should not allocate AP payment requests with no invoice lines', async () => {
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await allocateToBatch()
    const completedPaymentRequest = await db.sequence.findByPk(sequence.schemeId)
    expect(completedPaymentRequest.batchId).toBeUndefined()
  })

  test('should not allocate AR payment requests with no invoice lines', async () => {
    paymentRequest.ledger = 'AR'
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await allocateToBatch()
    const completedPaymentRequest = await db.sequence.findByPk(sequence.schemeId)
    expect(completedPaymentRequest.batchId).toBeUndefined()
  })

  test('should create AP batch', async () => {
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const batches = await db.batch.findAll({ where: { ledger: 'AP', sequence: sequence.nextAP } })
    expect(batches.length).toBe(1)
  })

  test('should allocate AP payment requests to next batch', async () => {
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const completedPaymentRequest = await db.completedPaymentRequest.findByPk(sequence.schemeId)
    const batch = await db.batch.findOne({ where: { ledger: 'AP', sequence: sequence.nextAP } })
    expect(completedPaymentRequest.batchId).toBe(batch.batchId)
  })

  test('should create AR batch', async () => {
    paymentRequest.ledger = 'AR'
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const batches = await db.batch.findAll({ where: { ledger: 'AR', sequence: sequence.nextAR } })
    expect(batches.length).toBe(1)
  })

  test('should allocate AR payment requests to next batch', async () => {
    paymentRequest.ledger = 'AR'
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const completedPaymentRequest = await db.completedPaymentRequest.findByPk(sequence.schemeId)
    const batch = await db.batch.findOne({ where: { ledger: 'AR', sequence: sequence.nextAR } })
    expect(completedPaymentRequest.batchId).toBe(batch.batchId)
  })

  test('should increase sequence for AP payment requests', async () => {
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const sequenceResult = await db.sequence.findByPk(sequence.schemeId)
    expect(sequenceResult.nextAP).toBe(6)
    expect(sequenceResult.nextAR).toBe(3)
  })

  test('should increase sequence for AR payment requests', async () => {
    paymentRequest.ledger = 'AR'
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const sequenceResult = await db.sequence.findByPk(sequence.schemeId)
    expect(sequenceResult.nextAP).toBe(5)
    expect(sequenceResult.nextAR).toBe(4)
  })

  test('should set initial dates for AP batch', async () => {
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const batch = await db.batch.findOne({ where: { ledger: 'AP', sequence: sequence.nextAP } })
    expect(batch.created).toBeDefined()
    expect(batch.started).toBeNull()
    expect(batch.published).toBeNull()
  })

  test('should set initial dates for AR batch', async () => {
    paymentRequest.ledger = 'AR'
    await db.scheme.create(scheme)
    await db.sequence.create(sequence)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await allocateToBatch()
    const batch = await db.batch.findOne({ where: { ledger: 'AR', sequence: sequence.nextAR } })
    expect(batch.created).toBeDefined()
    expect(batch.started).toBeNull()
    expect(batch.published).toBeNull()
  })
})
