const { FDMR, BPS } = require('../constants/schemes')
const { DOM00, DOM01, DOM10 } = require('../constants/domestic-fund-codes')

const addDualAccounting = (paymentRequests, previousPaymentRequests) => {
  for (const paymentRequest of paymentRequests) {
    for (const invoiceLine of paymentRequest.invoiceLines) {
      if (paymentRequest.schemeId === FDMR || paymentRequest.schemeId === BPS) {
        if (paymentRequest.marketingYear >= 2020) {
          invoiceLine.fundCode = DOM10
        } else {
          if (previousPaymentRequests.length) {
            const previousFundCode = previousPaymentRequests[previousPaymentRequests.length - 1].invoiceLines[0].fundCode
            if (previousFundCode === DOM00 || previousFundCode === DOM01) {
              invoiceLine.fundCode = previousFundCode
            } else {
              invoiceLine.fundCode = DOM01
            }
          } else {
            invoiceLine.fundCode = DOM00
          }
        }
      }
    }
  }
  return paymentRequests
}

module.exports = addDualAccounting
