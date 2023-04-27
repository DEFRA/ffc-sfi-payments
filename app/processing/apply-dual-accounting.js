const { FDMR } = require('../constants/schemes')
const { DOM00, DOM01, DOM10 } = require('../constants/domestic-fund-codes')

const addDualAccounting = (paymentRequests, previousPaymentRequests) => {
  for (const paymentRequest of paymentRequests) {
    for (const invoiceLine of paymentRequest.invoiceLines) {
      if (invoiceLine.schemeId === FDMR) {
        if (invoiceLine.marketingYear >= 2020) {
          invoiceLine.fundCode = DOM10
        } else {
          if (previousPaymentRequests.length >= 1) {
            if (previousPaymentRequests[previousPaymentRequests.length - 1].invoiceLine.fundCode) {
              invoiceLine.fundCode = previousPaymentRequests[previousPaymentRequests.length - 1].invoiceLine.fundCode
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
