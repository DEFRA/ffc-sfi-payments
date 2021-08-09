const db = require('../../../../app/data')
const getFrn = require('../../../../app/inbound/get-frn')
let frn

describe('get frn', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    frn = {
      sbi: 123456789,
      frn: 1234567890
    }

    await db.frn.create(frn)
  })

  test('should return frn for sbi', async () => {
    const result = await getFrn(123456789)
    expect(result).toBe(1234567890)
  })

  test('should return undefined if no match for sbi', async () => {
    const result = await getFrn(123456788)
    expect(result).toBe(0)
  })
})
