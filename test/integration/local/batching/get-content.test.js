const db = require('../../../../app/data')
const getContent = require('../../../../app/batching/get-content')

describe('get content', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })
})
