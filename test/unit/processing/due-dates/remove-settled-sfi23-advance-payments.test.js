const { SFI23, SFI } = require('../../../../app/constants/schemes')
const { removeSettledSFI23AdvancePayments } = require('../../../../app/processing/due-dates/remove-settled-sfi23-advance-payments')

describe('remove all settled SFI23 advance payments', () => {
  test('should remove sfi23 advance payments if they are settled', () => {
    const paymentRequests = [
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        settledValue: 100,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI,
        paymentRequestNumber: 0,
        settledValue: 100,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 1,
        settledValue: 100,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        settledValue: 0,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        settledValue: 100,
        dueDate: '01/01/2024'
      }
    ]

    const result = removeSettledSFI23AdvancePayments(paymentRequests)

    expect(result).toEqual([
      {
        schemeId: SFI,
        paymentRequestNumber: 0,
        settledValue: 100,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 1,
        settledValue: 100,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        settledValue: 0,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        dueDate: '01/01/2023'
      },
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        settledValue: 100,
        dueDate: '01/01/2024'
      }
    ])
  })

  test('should return an empty array if all payment requests are settled sfi23 advance payments', () => {
    const paymentRequests = [
      {
        schemeId: SFI23,
        paymentRequestNumber: 0,
        settledValue: 100,
        dueDate: '01/01/2023'
      }
    ]

    const result = removeSettledSFI23AdvancePayments(paymentRequests)

    expect(result).toEqual([])
  })
})
