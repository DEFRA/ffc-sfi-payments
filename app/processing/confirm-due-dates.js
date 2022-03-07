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

  const totalValue = getTotalValue(previousPaymentRequests)
  const settledValue = getSettledValue(previousPaymentRequests)
  const paymentSchedule = getPaymentSchedule(firstPaymentRequest.schedule, firstPaymentRequest.dueDate, totalValue, settledValue)
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

const getPaymentSchedule = (schedule, dueDate, totalValue, settledValue) => {
  const startDate = moment(dueDate, 'DD/MM/YYYY')
  const frequency = schedule.charAt(0)
  const totalPayments = schedule.substring(1, schedule.length)

  switch (frequency) {
    case 'Q':
      return getSchedule(startDate, totalPayments, totalValue, settledValue, 3, 'month')
    case 'M':
      return getSchedule(startDate, totalPayments, totalValue, settledValue, 1, 'month')
    case 'D':
      return getSchedule(startDate, totalPayments, totalValue, settledValue, 1, 'day')
    default:
      throw new Error(`Unknown schedule ${schedule}`)
  }
}

const getSchedule = (startDate, totalPayments, totalValue, settledValue, increment, unit) => {
  const currentDate = new Date()
  const scheduleDates = []
  for (let i = 0; i < totalPayments; i++) {
    scheduleDates.push({
      dueDate: startDate.format('DD/MM/YYYY'),
      outstanding: startDate >= currentDate
    })
    startDate = startDate.add(increment, unit)
  }
  return scheduleDates
}

module.exports = confirmDueDates
