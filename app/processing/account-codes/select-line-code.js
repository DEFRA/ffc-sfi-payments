const { AP } = require('../../constants/ledgers')
const { ADMINISTRATIVE } = require('../../constants/debt-types')

const selectLineCode = (accountCodes, paymentRequest, invoiceLine) => {
  if (paymentRequest.ledger === AP) {
    if (invoiceLine.stateAid) {
      return invoiceLine.accountCode
    }
    return accountCodes.ap
  }
  return paymentRequest.debtType === ADMINISTRATIVE ? accountCodes.arAdmin : accountCodes.arIrregular
}

module.exports = {
  selectLineCode
}
