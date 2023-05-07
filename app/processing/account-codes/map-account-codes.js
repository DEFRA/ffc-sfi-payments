const db = require('../../data')
const { CS, MANUAL } = require('../../constants/schemes')
const { selectLineCode } = require('./select-line-code')

const mapAccountCodes = async (paymentRequest) => {
  // CS AP account codes are already included in the payment request.  No action needed until we support CS adjustments.
  // Manual Invoice account code do not require mapping.
  if (paymentRequest.schemeId === CS || paymentRequest.schemeId === MANUAL) {
    return
  }
  for (const invoiceLine of paymentRequest.invoiceLines) {
    const accountCodesForLineDescription = await db.accountCode.findOne({
      where: {
        schemeId: paymentRequest.schemeId,
        lineDescription: invoiceLine.description
      }
    })

    invoiceLine.accountCode = selectLineCode(accountCodesForLineDescription, paymentRequest.ledger, paymentRequest.debtType)
  }
}

module.exports = {
  mapAccountCodes
}
