const { AP, AR } = require('../../../app/ledgers')
const confirmDueDates = require('../../../app/processing/confirm-due-dates')

const currentDate = new Date(2022, 2, 14)

describe('confirm due dates', () => {
  test('should return no change if no previous requests', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, undefined, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should return no change if no previous requests as empty array', () => {
    const paymentRequests = [{
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, [], currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should not update schedule when quarterly and no outstanding payments', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '15/03/2020',
      schedule: 'Q4',
      value: 1000,
      settledValue: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should update schedule to cover remaining payments when quarterly and three remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/03/2022',
      schedule: 'Q4',
      value: 1000,
      settledValue: 250
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q3')
  })

  test('should update schedule to cover remaining payments when quarterly and two remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/12/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 500
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q2')
  })

  test('should update schedule to cover remaining payments when quarterly and one remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/09/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 750
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q1')
  })

  test('should not update schedule when monthly and no outstanding payments', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '08/09/2021',
      schedule: 'M4',
      value: 1000,
      settledValue: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('M4')
  })

  test('should update schedule to cover remaining payments when monthly and three remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/03/2022',
      schedule: 'M4',
      value: 1000,
      settledValue: 250
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/04/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('M3')
  })

  test('should update schedule to cover remaining payments when monthly and two remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/02/2022',
      schedule: 'M4',
      value: 1000,
      settledValue: 500
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/04/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('M2')
  })

  test('should update schedule to cover remaining payments when monthly and one remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/01/2022',
      schedule: 'M4',
      value: 1000,
      settledValue: 250
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/04/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('M1')
  })

  test('should not update schedule when daily and no outstanding payments', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '01/03/2022',
      schedule: 'D4',
      value: 1000,
      settledValue: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('D4')
  })

  test('should update schedule to cover remaining payments when daily and three remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '13/03/2022',
      schedule: 'D4',
      value: 1000,
      settledValue: 250
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('14/03/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('D3')
  })

  test('should update schedule to cover remaining payments when daily and two remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '12/03/2022',
      schedule: 'D4',
      value: 1000,
      settledValue: 500
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('14/03/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
  })

  test('should update schedule to cover remaining payments when daily and one remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '11/03/2022',
      schedule: 'D4',
      value: 1000,
      settledValue: 750
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('14/03/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('D1')
  })

  test('should not update schedule when top up', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: 100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/03/2022',
      schedule: 'Q4',
      value: 1000,
      settledValue: 0
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should not update schedule when AR ledger', () => {
    const paymentRequests = [{
      ledger: AR,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/04/2022',
      schedule: 'Q4',
      value: 1000,
      settledValue: 0
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should use PR1 as schedule', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/03/2022',
      schedule: 'Q4',
      value: 1000,
      settledValue: 250
    }, {
      paymentRequestNumber: 2,
      ledger: AP,
      dueDate: '10/04/2022',
      schedule: 'Q4',
      value: 1000,
      settledValue: 250
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q3')
  })

  test('should update all negative AP', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }, {
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '12/03/2022',
      schedule: 'D4',
      value: 1000,
      settledValue: 500
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('14/03/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
    expect(confirmedPaymentRequests[1].dueDate).toBe('14/03/2022')
    expect(confirmedPaymentRequests[1].schedule).toBe('D2')
  })

  test('should update only negative AP when multiple', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }, {
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: 100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '12/03/2022',
      schedule: 'D4',
      value: 1000,
      settledValue: 500
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('14/03/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
    expect(confirmedPaymentRequests[1].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[1].schedule).toBe('D4')
  })

  test('should update only negative AP when also AR', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }, {
      ledger: AR,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '12/03/2022',
      schedule: 'D4',
      value: 1000,
      settledValue: 500
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('14/03/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
    expect(confirmedPaymentRequests[1].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[1].schedule).toBe('D4')
  })

  test('should throw error if invalid schedule', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '09/03/2022',
      schedule: 'X4',
      value: 1000,
      settledValue: 500
    }]
    expect(() => confirmDueDates(paymentRequests, previousPaymentRequests)).toThrow()
  })

  test('should not update schedule when quarterly and no outstanding payments with BACS rejection', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/03/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 1250
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2021')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should update schedule to cover remaining payments when quarterly and three remaining with BACS rejection', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/03/2022',
      schedule: 'Q4',
      value: 1000,
      settledValue: 500
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q3')
  })

  test('should update schedule to cover remaining payments when quarterly and two remaining with BACS rejection', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/12/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 750
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q2')
  })

  test('should update schedule to cover remaining payments when quarterly and one remaining with BACS rejection', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/09/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q1')
  })

  test('should update schedule to cover remaining payments when multiple BACS rejection', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/12/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 2000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q2')
  })

  test('should update schedule to cover remaining payments when previous top up', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/12/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 500
    }, {
      paymentRequestNumber: 2,
      ledger: AP,
      dueDate: '10/12/2021',
      schedule: 'Q4',
      value: 100,
      settledValue: 50
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q2')
  })

  test('should update schedule to cover remaining payments when previous negative AP', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2021',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: '10/12/2021',
      schedule: 'Q4',
      value: 1000,
      settledValue: 500
    }, {
      paymentRequestNumber: 2,
      ledger: AP,
      dueDate: '10/12/2021',
      schedule: 'Q4',
      value: -400,
      settledValue: 0
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests, currentDate)
    expect(confirmedPaymentRequests[0].dueDate).toBe('10/06/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q2')
  })
})
