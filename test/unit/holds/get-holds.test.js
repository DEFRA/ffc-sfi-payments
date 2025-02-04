const db = require('../../../app/data')
const { getHolds } = require('../../../app/holds/get-holds')

jest.mock('../../../app/data', () => ({
  autoHold: {
    findAll: jest.fn()
  },
  hold: {
    findAll: jest.fn()
  },
  Sequelize: {
    col: jest.fn((col) => col)
  }
}))

describe('getHolds', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return merged results of holds and autoHolds', async () => {
    const holds = [{ holdId: 1, frn: 123 }]
    const autoHolds = [{ holdId: 2, frn: 456 }]
    db.hold.findAll.mockResolvedValue(holds)
    db.autoHold.findAll.mockResolvedValue(autoHolds)

    const result = await getHolds({
      pageNumber: undefined,
      pageSize: undefined
    })

    expect(result).toEqual([...holds, ...autoHolds])
  })

  test('should paginate results if pageNumber and pageSize are provided', async () => {
    const holds = [{ holdId: 1, frn: 123 }]
    const autoHolds = [{ holdId: 2, frn: 456 }]
    db.hold.findAll.mockResolvedValue(holds)
    db.autoHold.findAll.mockResolvedValue(autoHolds)

    const result = await getHolds({
      pageNumber: 1,
      pageSize: 1
    })

    expect(result).toEqual([{ holdId: 1, frn: 123 }])
  })

  test('should return empty array if no holds or autoHolds found', async () => {
    db.hold.findAll.mockResolvedValue([])
    db.autoHold.findAll.mockResolvedValue([])

    const result = await getHolds({
      pageNumber: undefined,
      pageSize: undefined
    })

    expect(result).toEqual([])
  })

  test('should handle invalid pageNumber and pageSize gracefully', async () => {
    const holds = [{ holdId: 1, frn: 123 }]
    const autoHolds = [{ holdId: 2, frn: 456 }]
    db.hold.findAll.mockResolvedValue(holds)
    db.autoHold.findAll.mockResolvedValue(autoHolds)

    const result = await getHolds({
      pageNumber: 'invalid',
      pageSize: 'invalid'
    })

    expect(result).toEqual([...holds, ...autoHolds])
  })
})
