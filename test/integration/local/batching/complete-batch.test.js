const db = require('../../../../app/data')
const completeBatch = require('../../../../app/batching/complete-batch')
const moment = require('moment')

describe('complete batch', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })
})
