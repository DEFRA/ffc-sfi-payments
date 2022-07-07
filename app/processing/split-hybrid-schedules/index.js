const { AP, AR } = require('../../ledgers')
const { SFI } = require('../../schemes')
const getNextSplitId = require('./get-next-split-id')
const hybridScheduleSplit = require('./hybrid-schedule-split')
const noScheduleSchemeCodes = require('./scheme-codes')

const splitHybridSchedules = (paymentRequests) => {
  // some SFI funding options should be paid immediately as opposed to split across payment schedule.
  // we therefore need to split into separate payment requests.
  if (!requiresSplit(paymentRequests)) {
    return paymentRequests
  }

  console.log(`Performing hybrid schedule split for ${paymentRequests[0].invoiceNumber}`)

  const apPaymentRequests = paymentRequests.filter(x => x.ledger === AP)
  const arPaymentRequests = paymentRequests.filter(x => x.ledger === AR)

  const splitPaymentRequests = getHybridScheduleSplit(apPaymentRequests)

  return arPaymentRequests.concat(splitPaymentRequests)
}

const requiresSplit = (paymentRequests) => {
  return paymentRequests[0].schemeId === SFI &&
    !paymentRequests.every(x => x.ledger === AR) &&
    paymentRequests.some(x => x.invoiceLines.some(y => noScheduleSchemeCodes.includes(y.schemeCode)))
}

const getHybridScheduleSplit = (paymentRequests) => {
  const finalPaymentRequests = []
  let splitId = 'C'
  paymentRequests.forEach(paymentRequest => {
    const splitRequests = hybridScheduleSplit(paymentRequest, splitId)
    splitRequests.forEach(splitRequest => {
      finalPaymentRequests.push(splitRequest)
    })
    splitId = getNextSplitId(splitId, 2)
  })
  return finalPaymentRequests.filter(x => x.invoiceLines.length > 0)
}

module.exports = splitHybridSchedules
