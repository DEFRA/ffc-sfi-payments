const { AP, AR } = require('../../../app/ledgers')
const confirmDueDates = require('../../../app/processing/confirm-due-dates')
const moment = require('moment')

describe('confirm due dates', () => {
  test('should return no change if no previous requests', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should return no change if no previous requests as empty array', () => {
    const paymentRequests = [{
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, [])
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should not update schedule when quarterly and no outstanding payments', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(2, 'year').format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should update schedule to cover remaining payments when quarterly and three remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'month').format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(2, 'month').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('Q3')
  })

  test('should update schedule to cover remaining payments when quarterly and two remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(4, 'month').format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(2, 'month').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('Q2')
  })

  test('should update schedule to cover remaining payments when quarterly and one remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(7, 'month').format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(2, 'month').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('Q1')
  })

  test('should not update schedule when monthly and no outstanding payments', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(2, 'year').format('DD/MM/YYYY'),
      schedule: 'M4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('M4')
  })

  test('should update schedule to cover remaining payments when monthly and three remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'month').add(1, 'day').format('DD/MM/YYYY'),
      schedule: 'M4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('M3')
  })

  test('should update schedule to cover remaining payments when monthly and two remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(2, 'month').add(1, 'day').format('DD/MM/YYYY'),
      schedule: 'M4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('M2')
  })

  test('should update schedule to cover remaining payments when monthly and one remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'M4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(3, 'month').add(1, 'day').format('DD/MM/YYYY'),
      schedule: 'M4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('M1')
  })

  test('should not update schedule when daily and no outstanding payments', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(2, 'year').format('DD/MM/YYYY'),
      schedule: 'D4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('D4')
  })

  test('should update schedule to cover remaining payments when daily and three remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).format('DD/MM/YYYY'),
      schedule: 'D4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('D3')
  })

  test('should update schedule to cover remaining payments when daily and two remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'day').format('DD/MM/YYYY'),
      schedule: 'D4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
  })

  test('should update schedule to cover remaining payments when daily and one remaining', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(2, 'day').format('DD/MM/YYYY'),
      schedule: 'D4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('D1')
  })

  test('should not update schedule when top up', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: 100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should not update schedule when AR ledger', () => {
    const paymentRequests = [{
      ledger: AR,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'month').format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[0].schedule).toBe('Q4')
  })

  test('should use PR1 as schedule', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'Q4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'month').format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }, {
      paymentRequestNumber: 2,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'year').format('DD/MM/YYYY'),
      schedule: 'Q4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(2, 'month').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('Q3')
  })

  test('should update all negative AP', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }, {
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'day').format('DD/MM/YYYY'),
      schedule: 'D4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
    expect(confirmedPaymentRequests[1].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[1].schedule).toBe('D2')
  })

  test('should update only negative AP when multiple', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }, {
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: 100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'day').format('DD/MM/YYYY'),
      schedule: 'D4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
    expect(confirmedPaymentRequests[1].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[1].schedule).toBe('D4')
  })

  test('should update only negative AP when also AR', () => {
    const paymentRequests = [{
      ledger: AP,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }, {
      ledger: AR,
      dueDate: '09/11/2022',
      schedule: 'D4',
      value: -100
    }]
    const previousPaymentRequests = [{
      paymentRequestNumber: 1,
      ledger: AP,
      dueDate: moment(new Date()).subtract(1, 'day').format('DD/MM/YYYY'),
      schedule: 'D4',
      value: 1000
    }]
    const confirmedPaymentRequests = confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(confirmedPaymentRequests[0].dueDate).toBe(moment(new Date()).add(1, 'day').format('DD/MM/YYYY'))
    expect(confirmedPaymentRequests[0].schedule).toBe('D2')
    expect(confirmedPaymentRequests[1].dueDate).toBe('09/11/2022')
    expect(confirmedPaymentRequests[1].schedule).toBe('D4')
  })
})
