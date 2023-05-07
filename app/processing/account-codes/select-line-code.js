const { ADMINISTRATIVE } = require('../../constants/debt-types')
const { AP } = require('../../constants/ledgers')

const selectLineCode = (accountCodes, ledger, debtType) => {
  if (ledger === AP) {
    return accountCodes.accountCodeAP
  }
  return debtType === ADMINISTRATIVE ? accountCodes.accountCodeARAdm : accountCodes.accountCodeARIrr
}

module.exports = {
  selectLineCode
}
