const { ES, FC, IMPS } = require('../constants/schemes')
const { GENESIS, GLOS, IMPS: IMPS_SOURCE } = require('../constants/source-systems')

const getSettlementFilter = (settlement) => {
  switch (settlement.sourceSystem) {
    case GENESIS:
      return {
        schemeId: ES,
        agreementNumber: settlement.transactionNumber
      }
    case GLOS:
      return {
        schemeId: FC,
        frn: settlement.frn,
        contractNumber: settlement.claimNumber,
        agreementNumber: settlement.agreementNumber
      }
    case IMPS_SOURCE:
      return {
        schemeId: IMPS,
        agreementNumber: settlement.transactionNumber.split('-')[0]
      }
    default:
      return {
        invoiceNumber: settlement.invoiceNumber
      }
  }
}

module.exports = {
  getSettlementFilter
}
