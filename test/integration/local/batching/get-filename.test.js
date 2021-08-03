const db = require('../../../../app/data')
const getFilename = require('../../../../app/batching/get-filename')
let batch

describe('get filename', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    batch = {
      ledger: 'AP',
      sequence: 1,
      started: new Date(2022, 2, 1, 22, 27, 0, 0),
      scheme: {
        batchProperties: {
          prefix: 'PFELM',
          suffix: ' (SITI)'
        }
      }
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should return filename for sequence 1', async () => {
    const filename = getFilename(batch)
    expect(filename).toMatch(new RegExp(/PFELM0001_AP_\d{14} (SITI).csv/))
  })

  test('should return filename for sequence 10', async () => {
    batch.sequence = 10
    const filename = getFilename(batch)
    expect(filename).toBe(new RegExp(/PFELM0010_AP_\d{14} (SITI).csv/))
  })

  test('should return filename for AR', async () => {
    batch.ledger = 'AR'
    const filename = getFilename(batch)
    expect(filename).toBe(new RegExp(/PFELM0001_AR_\d{14} (SITI).csv/))
  })
})
