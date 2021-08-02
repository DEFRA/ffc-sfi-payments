const db = require('../../../../app/data')
const getBatches = require('../../../../app/batching/get-batches')
const config = require('../../../../app/config')
const moment = require('moment')
let scheme
let batch
let paymentRequest
let invoiceLine
let batchProperties

describe('get batches', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI',
      active: true
    }

    batchProperties = {
      schemeId: 1,
      prefix: 'PFELM',
      suffix: ' (SITI)'
    }

    batch = {
      batchId: 1,
      schemeId: 1,
      ledger: 'AP',
      created: new Date()
    }

    paymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      ledger: 'AP',
      batchId: 1
    }

    invoiceLine = {
      completedInvoiceLineId: 1,
      completedPaymentRequestId: 1
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should not return batches if no payment requests', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    const batches = await getBatches()
    expect(batches.length).toBe(0)
  })

  test('should not return batches if payment requests have no invoice lines', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    const batches = await getBatches()
    expect(batches.length).toBe(0)
  })

  test('should not return batches if no batch properties', async () => {
    await db.scheme.create(scheme)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    const batches = await getBatches()
    expect(batches.length).toBe(0)
  })

  test('should return batch if not complete', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    const batches = await getBatches()
    expect(batches.length).toBe(1)
  })

  test('should return batch if some payment requests do not have lines', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    paymentRequest.completedPaymentRequestId = 2
    await db.completedPaymentRequest.create(paymentRequest)
    const batches = await getBatches()
    expect(batches.length).toBe(1)
    expect(batches[0].paymentRequests.length).toBe(1)
    expect(batches[0].paymentRequests[0].completedPaymentRequestId).toBe(1)
  })

  test('should return all payment requests in batch', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    paymentRequest.completedPaymentRequestId = 2
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.completedInvoiceLineId = 2
    invoiceLine.completedPaymentRequestId = 2
    await db.completedInvoiceLine.create(invoiceLine)
    const batches = await getBatches()
    expect(batches.length).toBe(1)
    expect(batches[0].paymentRequests.length).toBe(2)
  })

  test('should nt return batch if complete', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    batch.published = new Date()
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    const batches = await getBatches()
    expect(batches.length).toBe(0)
  })

  test('should not return batch if in progress', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    batch.started = moment().subtract(1, 'minute')
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    const batches = await getBatches()
    expect(batches.length).toBe(0)
  })

  test('should return batch if in progress but exceeded allowance', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    batch.started = moment().subtract(10, 'minute')
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    const batches = await getBatches()
    expect(batches.length).toBe(1)
  })

  test('should update started', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await getBatches()
    const batchResult = await db.batch.findByPk(batch.batchId)
    expect(batchResult.started).not.toBeNull()
  })

  test('should restrict batches to cap', async () => {
    config.batchCap = 1
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    batch.batchId = 2
    await db.batch.create(batch)
    paymentRequest.completedPaymentRequestId = 2
    paymentRequest.batchId = 2
    await db.completedPaymentRequest.create(paymentRequest)
    invoiceLine.completedInvoiceLineId = 2
    invoiceLine.completedPaymentRequestId = 2
    await db.completedInvoiceLine.create(invoiceLine)
    const batches = await getBatches()
    expect(batches.length).toBe(1)
  })
})
