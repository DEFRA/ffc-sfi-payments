const value = require('../config')
const { AP } = require('../ledgers')
const moment = require('moment')

const confirmDueDates = (paymentRequests, previousPaymentRequests) => {
  // to avoid balloon reduction, any recoveries routed to AP must get a new schedule and due date covering only remaining payments
  // and not include schedules in the past

  const firstPaymentRequest = previousPaymentRequests.find(x => x.paymentRequestNumber === 1)
  // if payment is not split across schedule no action needed
  if (!firstPaymentRequest.schedule) {
    return paymentRequests
  }

  const paymentSchedule = getPaymentSchedule(firstPaymentRequest.schedule, firstPaymentRequest.dueDate)
  const outstandingSchedule = paymentSchedule.filter(x => x.outstanding)

  // if no payments left in schedule then no action needed
  if (!outstandingSchedule.length) {
    return paymentRequests
  }

  paymentRequests
    .filter(x => x.ledger === AP && value < 0)
    .map(paymentRequest => {
      paymentRequest.schedule = `${firstPaymentRequest.schedule.charAt(0).toUpper()}${outstandingSchedule.length}`
      paymentRequest.dueDate = moment(outstandingSchedule[0].dueDate).format('DD/MM/YYYY')
      return paymentRequest
    })

  return paymentRequests
}

const getPaymentSchedule = (schedule, dueDate) => {
  const startDate = moment(dueDate, 'DD/MM/YYYY')
  const frequency = schedule.charAt(0).toUpper()
  const totalPayments = schedule.substring(1, schedule.length)

  switch (frequency) {
    case 'Q':
      return getSchedule(startDate, totalPayments, 3, 'month')
    case 'M':
      return getSchedule(startDate, totalPayments, 1, 'month')
    case 'D':
      return getSchedule(startDate, totalPayments, 1, 'day')
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

const getSchedule = (startDate, totalPayments, increment, unit) => {
  const currentDate = new Date()
  const scheduleDates = []
  for (let i = 0; i < totalPayments; i++) {
    scheduleDates.push({
      dueDate: startDate,
      outstanding: startDate < currentDate
    })
    startDate = moment(startDate).add(increment, unit)
  }
  return scheduleDates
}

module.exports = confirmDueDates
