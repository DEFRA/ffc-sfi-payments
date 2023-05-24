const moment = require('moment')

jest.mock('../../../../app/processing/due-dates/get-expected-value')
const { getExpectedValue: mockGetExpectedValue } = require('../../../../app/processing/due-dates/get-expected-value')

const { DUE_DATE } = require('../../../mocks/values/due-date')

const { MONTH } = require('../../../../app/constants/time-periods')
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

    scheduleDate = moment(DUE_DATE, DATE_FORMAT)
    totalPayments = 4
    settledValue = 0
    totalValue = 100
    increment = 3
    unit = MONTH
    currentDate = new Date(2025, 0, 1)
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
    expect(result[0].dueDate).toEqual('01/04/2023')
  })

  test('should return second schedule due date as due date plus increment', () => {
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result[1].dueDate).toEqual('01/07/2023')
  })

  test('should return third schedule due date as second date plus increment', () => {
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result[2].dueDate).toEqual('01/10/2023')
  })

  test('should return fourth schedule due date as third date plus increment', () => {
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result[3].dueDate).toEqual('01/01/2024')
  })

  test('should return no payments as outstanding if current date is after final due date and all payments made', () => {
    settledValue = 100
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result.every(x => !x.outstanding)).toBeTruthy()
  })

  test('should return all payments as outstanding if current date is before first due date and no payments made', () => {
    settledValue = 0
    currentDate = new Date(2022, 0, 1)
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result.every(x => x.outstanding)).toBeTruthy()
  })

  test('should return first payment as not outstanding if current date is after first due date and first payment made', () => {
    settledValue = 25
    const result = getSchedule(scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate)
    expect(result[0].outstanding).toBeFalsy()
  })
})
