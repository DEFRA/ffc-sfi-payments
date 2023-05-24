jest.mock('../../../app/settlement/update-settlement-status')
const { updateSettlementStatus: mockUpdateSettlementStatus } = require('../../../app/settlement/update-settlement-status')

jest.mock('../../../app/event')
const { sendProcessingReturnEvent: mockSendProcessingReturnEvent } = require('../../../app/event')

const { processSettlement } = require('../../../app/settlement/process-settlement')

let settlement

describe('process settlement', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUpdateSettlementStatus.mockResolvedValue(true)

    settlement = JSON.parse(JSON.stringify(require('../../mocks/settlement')))
  })

  test('should update settlement status if settled', async () => {
    await processSettlement(settlement)
    expect(mockUpdateSettlementStatus).toHaveBeenCalledWith(settlement)
  })

  test('should send non-error processing return event if settled and has matched payment request', async () => {
    await processSettlement(settlement)
    expect(mockSendProcessingReturnEvent).toHaveBeenCalledWith(settlement)
  })

  test('should return true if settled and has matched payment request', async () => {
    const result = await processSettlement(settlement)
    expect(result).toBe(true)
  })

  test('should send error processing return event if settled and has no matched payment request', async () => {
    mockUpdateSettlementStatus.mockResolvedValue(false)
    await processSettlement(settlement)
    expect(mockSendProcessingReturnEvent).toHaveBeenCalledWith(settlement, true)
  })

  test('should return false if settled and has no matched payment request', async () => {
    mockUpdateSettlementStatus.mockResolvedValue(false)
    const result = await processSettlement(settlement)
    expect(result).toBe(false)
  })

  test('should send error processing return event if not settled', async () => {
    settlement.settled = false
    await processSettlement(settlement)
    expect(mockSendProcessingReturnEvent).toHaveBeenCalledWith(settlement, true)
  })

  test('should return false if not settled', async () => {
    settlement.settled = false
    const result = await processSettlement(settlement)
    expect(result).toBe(false)
  })

  test('should not update settlement status if not settled', async () => {
    settlement.settled = false
    await processSettlement(settlement)
    expect(mockUpdateSettlementStatus).not.toHaveBeenCalled()
  })
})
