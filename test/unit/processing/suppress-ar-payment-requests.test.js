jest.mock('../../../app/event')
const { sendSuppressedEvent: mockSendSuppressedEvent } = require('../../../app/event')

const { AP, AR } = require('../../../app/constants/ledgers')

const { suppressARPaymentRequests } = require('../../../app/processing/suppress-ar-payment-requests')

let paymentRequest
let completedPaymentRequests

describe('filter-ap-payment-requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = {
      value: -100
    }
    completedPaymentRequests = [{
      ledger: AP,
      value: -75
    }, {
      ledger: AR,
      value: -25
    }]
  })

  test('should set all AR payment requests values to 0', async () => {
    const filteredPaymentRequests = await suppressARPaymentRequests(paymentRequest, completedPaymentRequests)
    expect(filteredPaymentRequests.find(x => x.ledger === AR).value).toBe(0)
  })

  test('should set not set all AP payment requests values to 0', async () => {
    const filteredPaymentRequests = await suppressARPaymentRequests(paymentRequest, completedPaymentRequests)
    expect(filteredPaymentRequests.find(x => x.ledger === AP).value).toBe(-75)
  })

  test('should return all payment requests', async () => {
    const filteredPaymentRequests = await suppressARPaymentRequests(paymentRequest, completedPaymentRequests)
    expect(filteredPaymentRequests.length).toBe(2)
  })

  test('should send suppressed event', async () => {
    await suppressARPaymentRequests(paymentRequest, completedPaymentRequests)
    expect(mockSendSuppressedEvent).toHaveBeenCalledWith(paymentRequest, -100, -75, -25)
  })
})
