const db = require('../../../../app/data')
const generateBatches = require('../../../../app/batching/generate-batches')
const { AP } = require('../../../../app/ledgers')
let scheme
let batch
let paymentRequest
let invoiceLine
let batchProperties

describe('generate batches', () => {
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
      ledger: AP,
      sequence: 1,
      created: new Date()
    }

    paymentRequest = {
      completedPaymentRequestId: 1,
      paymentRequestId: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      ledger: AP,
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

  test('should generate batch and update as published', async () => {
    await db.scheme.create(scheme)
    await db.batchProperties.create(batchProperties)
    await db.batch.create(batch)
    await db.paymentRequest.create(paymentRequest)
    await db.completedPaymentRequest.create(paymentRequest)
    await db.completedInvoiceLine.create(invoiceLine)
    await generateBatches()
    const batchResult = await db.batch.findByPk(batch.batchId)
    expect(batchResult.published).not.toBeNull()
  })
})
