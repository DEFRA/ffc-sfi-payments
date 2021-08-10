const db = require('../data')
const { AP } = require('../ledgers')

const mapAccountCodes = async (paymentRequest) => {
  for (const invoiceLine of paymentRequest.invoiceLines) {
    const accountCode = await db.accountCode.findOne({
      include: [{
        model: db.schemeCode,
        as: 'schemeCode'
      }],
      where: {
        '$schemeCode.schemeCode$': invoiceLine.schemeCode,
        lineDescription: invoiceLine.description
      }
    })

    invoiceLine.accountCode = paymentRequest.ledger === AP ? accountCode.accountCodeAP : accountCode.accountCodeAR
  }
}

module.exports = mapAccountCodes
