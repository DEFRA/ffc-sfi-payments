const db = require('../../../../app/data')
const getBatches = require('../../../../app/batching/get-batches')
const config = require('../../../../app/config')
const moment = require('moment')

describe('get batches', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })
})
