const moment = require('moment')

jest.mock('../../../../app/processing/due-dates/get-expected-value')
const { getExpectedValue: mockGetExpectedValue } = require('../../../../app/processing/due-dates/get-expected-value')

const { MONTH } = require('../../../../app/constants/time-periods')
const { DUE_DATE } = require('../../../mocks/values/due-date')
const { DATE_FORMAT } = require('../../../../app/constants/date-formats')

const { getSchedule } = require('../../../../app/processing/due-dates/get-schedule')

let scheduleDate
let totalPayments
let settledValue
let totalValue
let increment
let unit
let currentDate

describe('get schedule', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetExpectedValue.mockReturnValueOnce(25)
    mockGetExpectedValue.mockReturnValueOnce(50)
    mockGetExpectedValue.mockReturnValueOnce(75)
    mockGetExpectedValue.mockReturnValueOnce(100)

    scheduleDate = moment(DUE_DATE)
    totalPayments = 4
    settledValue = 0
    totalValue = 100
    increment = 3
    unit = MONTH
    currentDate = new Date()
  })

  test('should return empty array if total payments is 0', () => {
    totalPayments = 0
    expect(getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)).toEqual([])
  })

  test('should return empty array if total payments is less than 0', () => {
    totalPayments = -1
    expect(getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)).toEqual([])
  })

  test('should calculate expected value for each payment', () => {
    getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(mockGetExpectedValue).toHaveBeenCalledTimes(4)
  })

  test('should return schedule for each payment', () => {
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result.length).toEqual(4)
  })

  test('should return first schedule due date as due date', () => {
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result[0].dueDate).toEqual(scheduleDate.format(DATE_FORMAT))
  })
})
