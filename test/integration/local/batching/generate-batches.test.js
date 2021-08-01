const db = require('../../../../app/data')
const generateBatches = require('../../../../app/batching/generate-batches')
const moment = require('moment')

describe('generate batches', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })
})
