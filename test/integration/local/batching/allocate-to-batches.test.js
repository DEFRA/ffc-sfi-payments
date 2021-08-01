const allocateToBatch = require('../../../../app/batching/allocate-to-batches')
const db = require('../../../../app/data')

describe('allocate to batch', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })
})
