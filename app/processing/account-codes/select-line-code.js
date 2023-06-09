const { AP } = require('../../constants/ledgers')
const { ADMINISTRATIVE } = require('../../constants/debt-types')

const selectLineCode = (accountCodes, ledger, debtType, stateAid, currentAccountCode) => {
  if (ledger === AP) {
    if (stateAid) {
      return currentAccountCode
    }
    return accountCodes.ap
  }
  return debtType === ADMINISTRATIVE ? accountCodes.arAdmin : accountCodes.arIrregular
}

module.exports = {
  selectLineCode
}
