const db = require('../data')
const { ADMINISTRATIVE } = require('../debt-types')
const { AP } = require('../ledgers')

const mapAccountCodes = async (paymentRequest) => {
  for (const invoiceLine of paymentRequest.invoiceLines) {
    const accountCodesForLineDescription = await db.accountCode.findOne({
      where: {
        schemeId: paymentRequest.schemeId,
        lineDescription: invoiceLine.description
      }
    })

    invoiceLine.accountCode = selectAccountCodeForLine(accountCodesForLineDescription, paymentRequest.ledger, paymentRequest.debtType)
  }
}

const selectAccountCodeForLine = (accountCodes, ledger, debtType) => {
  if (ledger === AP) {
    return accountCodes.accountCodeAP
  }
  return debtType === ADMINISTRATIVE ? accountCodes.accountCodeARAdm : accountCodes.accountCodeARIrr
}

module.exports = mapAccountCodes
