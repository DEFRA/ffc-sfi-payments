const { AP } = require('../../constants/ledgers')
const { Q3 } = require('../../constants/schedules')
const { SFI23 } = require('../../constants/schemes')

const handleSFI23AdvancePayments = (paymentRequests, previousPaymentRequests, paymentSchedule) => {
  const advancePayment = previousPaymentRequests?.find(x => x.paymentRequestNumber === 0)
  if (advancePayment &&
    /^.*2023$/.test(advancePayment?.dueDate) &&
    paymentRequests[0].schemeId === SFI23 &&
    paymentRequests[0].paymentRequestNumber === 1) {
    paymentRequests.filter(x => x.ledger === AP)
      .map(paymentRequest => {
        paymentRequest.schedule = `${paymentRequest.schedule.charAt(0)}3`
        paymentRequest.dueDate = paymentSchedule[1].dueDate
        return paymentRequest
      })
  }
}

module.exports = {
  handleSFI23AdvancePayments
}
