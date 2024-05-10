const { resetDueDatesForSFI23 } = require('../../../app/routing/reset-due-dates-for-sfi23')

describe('resetDueDatesForSFI23', () => {
  test('should reset due dates for SFI23 PPA with advanced payment', () => {
    const previousPaymentRequests = [
      { paymentRequestNumber: 0, dueDate: '31/12/2023' },
      { paymentRequestNumber: 1, dueDate: '31/01/2024' },
      { paymentRequestNumber: 2, dueDate: '28/02/2024' }
    ]

    const paymentRequests = [
      { id: 1, dueDate: '31/12/2023' },
      { id: 2, dueDate: '31/12/2023' }
    ]

    const dueDate = '31/01/2024'

    resetDueDatesForSFI23(paymentRequests, previousPaymentRequests, dueDate)

    expect(paymentRequests[0].dueDate).toBe('31/01/2024')
    expect(paymentRequests[1].dueDate).toBe('31/01/2024')
  })

  test('should not reset due dates if no advanced payment for SFI23 PPA', () => {
    const previousPaymentRequests = [
      { paymentRequestNumber: 1, dueDate: '31/01/2024' },
      { paymentRequestNumber: 2, dueDate: '28/02/2024' }
    ]

    const paymentRequests = [
      { id: 1, dueDate: '31/12/2023' },
      { id: 2, dueDate: '31/12/2023' }
    ]

    const dueDate = '31/01/2024'

    resetDueDatesForSFI23(paymentRequests, previousPaymentRequests, dueDate)

    expect(paymentRequests[0].dueDate).toBe('31/12/2023')
    expect(paymentRequests[1].dueDate).toBe('31/12/2023')
  })

  test('should not reset due dates if advanced payment due date does not match pattern', () => {
    const previousPaymentRequests = [
      { paymentRequestNumber: 0, dueDate: '31/12/2022' },
      { paymentRequestNumber: 1, dueDate: '31/01/2024' }
    ]

    const paymentRequests = [
      { id: 1, dueDate: '31/12/2023' },
      { id: 2, dueDate: '31/12/2023' }
    ]

    const dueDate = '31/01/2024'

    resetDueDatesForSFI23(paymentRequests, previousPaymentRequests, dueDate)

    expect(paymentRequests[0].dueDate).toBe('31/12/2023')
    expect(paymentRequests[1].dueDate).toBe('31/12/2023')
  })
})
