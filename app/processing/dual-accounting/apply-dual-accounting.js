const { FDMR, BPS, CS } = require('../../constants/schemes')
const { applyBPSDualAccounting } = require('./bps')
const { applyCSDualAccounting } = require('./cs')

const applyDualAccounting = (paymentRequests, previousPaymentRequests) => {
  if (paymentRequests[0].schemeId === FDMR || paymentRequests[0].schemeId === BPS) {
    return applyBPSDualAccounting(paymentRequests, previousPaymentRequests)
  } else if (paymentRequests[0].schemeId === CS) {
    return applyCSDualAccounting(paymentRequests, previousPaymentRequests)
  }
  return paymentRequests
}

module.exports = {
  applyDualAccounting
}
