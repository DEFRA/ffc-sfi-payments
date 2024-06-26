const db = require('../../../app/data')
const { getTrackingPaymentRequests } = require('../../../app/tracking-migration')

jest.mock('../../../app/data')

describe('get payment requests for tracking migration', () => {
  let transaction

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
    db.paymentRequest.findAll.mockReset()
    db.paymentRequest.update.mockReset()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should retrieve and update payment requests correctly', async () => {
    const mockPaymentRequests = [
      { paymentRequestId: 1, sentToTracking: false },
      { paymentRequestId: 2, sentToTracking: null }
    ]

    db.paymentRequest.findAll.mockResolvedValue(mockPaymentRequests)

    const limit = 10
    const result = await getTrackingPaymentRequests(limit)

    expect(db.paymentRequest.findAll).toHaveBeenCalledWith({
      where: {
        [db.Sequelize.Op.or]: [
          { sentToTracking: false },
          { sentToTracking: null }
        ],
        [db.Sequelize.Op.and]: [
          {
            [db.Sequelize.Op.or]: [
              { received: { [db.Sequelize.Op.lte]: new Date('2024-06-24') } },
              { migrationId: { [db.Sequelize.Op.ne]: null } }
            ]
          }
        ]
      },
      include: [{
        model: db.completedPaymentRequest,
        as: 'completedPaymentRequests',
        required: false
      }, {
        model: db.invoiceLine,
        as: 'invoiceLines',
        required: false
      }],
      limit,
      transaction
    })

    const paymentRequestIds = mockPaymentRequests.map(pr => pr.paymentRequestId)

    expect(db.paymentRequest.update).toHaveBeenCalledWith(
      { sentToTracking: true },
      {
        where: { paymentRequestId: paymentRequestIds },
        transaction
      }
    )

    expect(transaction.commit).toHaveBeenCalled()
    expect(result).toEqual(mockPaymentRequests)
  })

  test('should rollback transaction if an error occurs', async () => {
    const error = new Error('Test error')
    db.paymentRequest.findAll.mockRejectedValue(error)

    await expect(getTrackingPaymentRequests(10)).rejects.toThrow('Test error')

    expect(transaction.rollback).toHaveBeenCalled()
    expect(transaction.commit).not.toHaveBeenCalled()
  })

  test('should not update if no payment requests are retrieved', async () => {
    const mockPaymentRequests = []

    db.paymentRequest.findAll.mockResolvedValue(mockPaymentRequests)

    const limit = 10
    const result = await getTrackingPaymentRequests(limit)

    expect(db.paymentRequest.findAll).toHaveBeenCalledWith({
      where: {
        [db.Sequelize.Op.or]: [
          { sentToTracking: false },
          { sentToTracking: null }
        ],
        [db.Sequelize.Op.and]: [
          {
            [db.Sequelize.Op.or]: [
              { received: { [db.Sequelize.Op.lte]: new Date('2024-06-24') } },
              { migrationId: { [db.Sequelize.Op.ne]: null } }
            ]
          }
        ]
      },
      include: [{
        model: db.completedPaymentRequest,
        as: 'completedPaymentRequests',
        required: false
      }, {
        model: db.invoiceLine,
        as: 'invoiceLines',
        required: false
      }],
      limit,
      transaction
    })

    expect(db.paymentRequest.update).not.toHaveBeenCalled()
    expect(transaction.commit).toHaveBeenCalled()
    expect(result).toEqual(mockPaymentRequests)
  })
})
