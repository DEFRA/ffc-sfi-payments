const db = require('../../../../app/data')
const publishBatch = require('../../../../app/batching/publish-batch')

describe('publish batch', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })
})
