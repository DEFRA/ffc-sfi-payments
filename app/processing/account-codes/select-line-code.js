const { ADMINISTRATIVE } = require('../../constants/debt-types')
const { AP } = require('../../constants/ledgers')

const selectLineCode = (accountCodes, ledger, debtType) => {
  if (ledger === AP) {
    return accountCodes.ap
  }
  return debtType === ADMINISTRATIVE ? accountCodes.arAdmin : accountCodes.arIrregular
}

module.exports = {
  selectLineCode
}
