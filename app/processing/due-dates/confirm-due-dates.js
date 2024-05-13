const { AP } = require('../../constants/ledgers')
const { getFirstPaymentRequest } = require('./get-first-payment-request')
const { getSettledValue } = require('./get-settled-value')
const { getTotalValue } = require('./get-total-value')
const { getPaymentSchedule } = require('./get-payment-schedule')
const { handleSFI23AdvancePayments } = require('./handle-sfi23-advance-payments')

const confirmDueDates = (paymentRequests, previousPaymentRequests, currentDate = new Date()) => {
  // to avoid balloon reduction, any recoveries routed to AP must get a new schedule and due date covering only remaining payments
  // and not include schedules in the past
  const firstPaymentRequest = getFirstPaymentRequest(paymentRequests, previousPaymentRequests)

  // if payment is not split across schedule no action needed
  if (!firstPaymentRequest?.schedule) {
    return paymentRequests
  }

  const totalValueCurrent = getTotalValue(paymentRequests)

  // if total value is 0 then no action needed as no payment to be scheduled
  if (totalValueCurrent === 0) {
    return paymentRequests
  }

  const settledValue = getSettledValue(previousPaymentRequests)
  const totalValue = getTotalValue(previousPaymentRequests)
  const paymentSchedule = getPaymentSchedule(firstPaymentRequest.schedule, firstPaymentRequest.dueDate, settledValue, totalValue, currentDate)
  const outstandingSchedule = paymentSchedule.filter(x => x.outstanding)

  // if no payments left in schedule then no action needed
  if (!outstandingSchedule.length) {
    return paymentRequests
  }
  console.log(firstPaymentRequest?.schedule)
  console.log(outstandingSchedule)
  paymentRequests
    .filter(x => x.ledger === AP && x.value < 0)
    .map(paymentRequest => {
      paymentRequest.schedule = `${firstPaymentRequest.schedule.charAt(0)}${outstandingSchedule.length}`
      paymentRequest.dueDate = outstandingSchedule[0].dueDate
      return paymentRequest
    })

  handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)

  return paymentRequests
}

module.exports = {
  confirmDueDates
}
