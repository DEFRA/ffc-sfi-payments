const db = require('../../../../app/data')
const getFilename = require('../../../../app/batching/get-filename')

describe('get filename', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })
})
