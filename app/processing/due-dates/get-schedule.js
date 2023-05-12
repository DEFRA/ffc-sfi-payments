const { getExpectedValue } = require('./get-expected-value')

const getSchedule = (scheduleDate, totalPayments, settledValue, totalValue, increment, unit, currentDate) => {
  const scheduleDates = []
  let expectedSettlementValue = 0
  for (let i = 1; i <= totalPayments; i++) {
    expectedSettlementValue = getExpectedValue(totalValue, totalPayments, i)
    const cappedSettlementValue = settledValue <= expectedSettlementValue ? settledValue : expectedSettlementValue
    scheduleDates.push({
      dueDate: scheduleDate.format('DD/MM/YYYY'),
      outstanding: scheduleDate >= currentDate || cappedSettlementValue < expectedSettlementValue
    })
    scheduleDate = scheduleDate.add(increment, unit)
  }
  return scheduleDates
}

module.exports = {
  getSchedule
}
