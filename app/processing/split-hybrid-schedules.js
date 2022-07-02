const { v4: uuidv4 } = require('uuid')
const { AP, AR } = require('../ledgers')
const { SFI } = require('../schemes')
const calculateOverallDelta = require('./delta/calculate-overall-delta')
const createSplitInvoiceNumber = require('./delta/create-split-invoice-number')
const COMMONS_SCHEME_CODE = '90002'
const MOORLANDS_SCHEME_CODE = '90003'
const noScheduleSchemeCodes = [COMMONS_SCHEME_CODE, MOORLANDS_SCHEME_CODE]

const splitHybridSchedules = (paymentRequests) => {
  // some SFI funding options should be paid immediately as opposed to split across payment schedule.
  // we therefore need to split into separate payment requests.
  if (paymentRequests[0].schemeId !== SFI || paymentRequests.every(x => x.ledger === AR) || !paymentRequests.every(x => x.invoiceLines.some(y => noScheduleSchemeCodes.includes(y.schemeCode)))) {
    return paymentRequests
  }

  const apPaymentRequests = paymentRequests.filter(x => x.ledger === AP)
  const arPaymentRequests = paymentRequests.filter(x => x.ledger === AR)

  const splitPaymentRequests = getHybridScheduleSplit(apPaymentRequests)

  return arPaymentRequests.concat(splitPaymentRequests)
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
  return finalPaymentRequests
}

const hybridScheduleSplit = (paymentRequest, splitId) => {
  const schedulePaymentRequest = copyPaymentRequest(paymentRequest, splitId)
  const noSchedulePaymentRequest = copyPaymentRequest(paymentRequest, getNextSplitId(splitId))

  paymentRequest.invoiceLines.forEach(invoiceLine => {
    if (!noScheduleSchemeCodes.includes(invoiceLine.schemeCode)) {
      schedulePaymentRequest.invoiceLines.push(invoiceLine)
    } else {
      noSchedulePaymentRequest.invoiceLines.push(invoiceLine)
    }
  })

  noSchedulePaymentRequest.value = calculateOverallDelta(noSchedulePaymentRequest.invoiceLines)
  schedulePaymentRequest.value = calculateOverallDelta(schedulePaymentRequest.invoiceLines)

  return [schedulePaymentRequest, noSchedulePaymentRequest]
}

const getNextSplitId = (splitId, increment = 1) => {
  return String.fromCharCode(splitId.charCodeAt(0) + increment)
}

const copyPaymentRequest = (paymentRequest, splitId) => {
  return {
    ...paymentRequest,
    invoiceNumber: createSplitInvoiceNumber(paymentRequest.invoiceNumber, splitId, paymentRequest.schemeId),
    invoiceLines: [],
    referenceId: uuidv4()
  }
}

module.exports = splitHybridSchedules
