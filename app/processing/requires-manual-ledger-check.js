const { AR } = require('../ledgers')

const util = require('util')

const requiresManualLedgerCheck = (paymentRequests) => {
  console.log(`Payment requests: ${util.inspect(paymentRequests, false, null, true)}`)
  return paymentRequests.some(x => x.ledger === AR)
}

module.exports = requiresManualLedgerCheck
