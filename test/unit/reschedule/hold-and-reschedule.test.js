jest.mock('../../../app/reschedule/get-existing-hold')
const { getExistingHold: mockGetExistingHold } = require('../../../app/reschedule/get-existing-hold')

jest.mock('../../../app/holds')
const { addHold: mockAddHold } = require('../../../app/holds')

jest.mock('../../../app/reschedule/ensure-scheduled')
const { ensureScheduled: mockEnsureScheduled } = require('../../../app/reschedule/ensure-scheduled')

const { FRN } = require('../../mocks/values/frn')

const { holdAndReschedule } = require('../../../app/reschedule/hold-and-reschedule')

const paymentRequestId = 1
const holdCategoryId = 1
const transaction = {}

describe('hold and reschedule', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetExistingHold.mockResolvedValue(null)
  })

  test('should check if existing hold exists for FRN and hold category', async () => {
    await holdAndReschedule(paymentRequestId, holdCategoryId, FRN, transaction)
    expect(mockGetExistingHold).toHaveBeenCalledWith(holdCategoryId, FRN, transaction)
  })

  test('should add hold if none exists for same category', async () => {
    await holdAndReschedule(paymentRequestId, holdCategoryId, FRN, transaction)
    expect(mockAddHold).toHaveBeenCalledWith(FRN, holdCategoryId, transaction)
  })

  test('should not add hold if already exists for same category', async () => {
    mockGetExistingHold.mockResolvedValue({})
    await holdAndReschedule(paymentRequestId, holdCategoryId, FRN, transaction)
    expect(mockAddHold).not.toHaveBeenCalled()
  })

  test('should ensure payment request is scheduled for processing', async () => {
    await holdAndReschedule(paymentRequestId, holdCategoryId, FRN, transaction)
    expect(mockEnsureScheduled).toHaveBeenCalledWith(paymentRequestId, transaction)
  })
})
