const { AP } = require('../ledgers')
const moment = require('moment')

const confirmDueDates = (paymentRequests, previousPaymentRequests) => {
  // to avoid balloon reduction, any recoveries routed to AP must get a new schedule and due date covering only remaining payments
  // and not include schedules in the past
  const firstPaymentRequest = previousPaymentRequests?.find(x => x.paymentRequestNumber === 1)
  // if payment is not split across schedule no action needed
  if (!firstPaymentRequest?.schedule) {
    return paymentRequests
  }

  const settledValue = getSettledValue(previousPaymentRequests)
  const totalValue = getTotalValue(previousPaymentRequests)
  const paymentSchedule = getPaymentSchedule(firstPaymentRequest.schedule, firstPaymentRequest.dueDate, settledValue, totalValue)
  const outstandingSchedule = paymentSchedule.filter(x => x.outstanding)

  // if no payments left in schedule then no action needed
  if (!outstandingSchedule.length) {
    return paymentRequests
  }

  paymentRequests
    .filter(x => x.ledger === AP && x.value < 0)
    .map(paymentRequest => {
      paymentRequest.schedule = `${firstPaymentRequest.schedule.charAt(0)}${outstandingSchedule.length}`
      paymentRequest.dueDate = outstandingSchedule[0].dueDate
      return paymentRequest
    })

  return paymentRequests
}

const getTotalValue = (previousPaymentRequests) => {
  return previousPaymentRequests.filter(x => x.ledger === AP).reduce((x, y) => x + (y.value ?? 0), 0)
}

const getSettledValue = (previousPaymentRequests) => {
  return previousPaymentRequests.filter(x => x.ledger === AP).reduce((x, y) => x + (y.settledValue ?? 0), 0)
}

const getPaymentSchedule = (schedule, dueDate, settledValue, totalValue) => {
  const startDate = moment(dueDate, 'DD/MM/YYYY')
  const frequency = schedule.charAt(0)
  const totalPayments = schedule.substring(1, schedule.length)
  const segmentValue = getSegmentValue(totalValue, totalPayments)

  switch (frequency) {
    case 'Q':
      return getSchedule(startDate, totalPayments, settledValue, segmentValue, 3, 'month')
    case 'M':
      return getSchedule(startDate, totalPayments, settledValue, segmentValue, 1, 'month')
    case 'D':
      return getSchedule(startDate, totalPayments, settledValue, segmentValue, 1, 'day')
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

const getSegmentValue = (totalValue, totalPayments) => {
  return Math.ceil(totalValue / totalPayments)
}

const getSchedule = (startDate, totalPayments, settledValue, segmentValue, increment, unit, currentDate = new Date()) => {
  const scheduleDates = []
  let expectedSettlementValue = 0
  for (let i = 0; i < totalPayments; i++) {
    expectedSettlementValue += segmentValue
    scheduleDates.push({
      dueDate: startDate.format('DD/MM/YYYY'),
      outstanding: startDate >= currentDate && settledValue < expectedSettlementValue
    })
    startDate = startDate.add(increment, unit)
  }
  return scheduleDates
}

module.exports = confirmDueDates
