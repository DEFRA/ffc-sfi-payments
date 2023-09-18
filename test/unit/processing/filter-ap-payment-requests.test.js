jest.mock('../../../app/event')
const { sendSuppressedEvent: mockSendSuppressedEvent } = require('../../../app/event')

const { AP, AR } = require('../../../app/constants/ledgers')

const { filterAPPaymentRequests } = require('../../../app/processing/filter-ap-payment-requests')

let paymentRequest
let completedPaymentRequests

describe('filter-ap-payment-requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = {
      value: 100
    }
    completedPaymentRequests = [{
      ledger: AP,
      value: 50
    }, {
      ledger: AR,
      value: 50
    }]
  })

  test('should filter out AR payment requests', async () => {
    const filteredPaymentRequests = await filterAPPaymentRequests(paymentRequest, completedPaymentRequests)

    expect(filteredPaymentRequests).toEqual([{
      ledger: AP,
      value: 50
    }])
  })
})
