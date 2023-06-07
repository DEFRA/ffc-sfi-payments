const { CS } = require('../../../constants/schemes')
const { calculateCoreLineDeltas } = require('./calculate-core-line-deltas')
const { calculateCSLineDeltas } = require('./calculate-cs-line-deltas')

const calculateLineDeltas = (schemeId, invoiceLines, defaultAgreementNumber) => {
  if (schemeId === CS) {
    return calculateCSLineDeltas(invoiceLines, defaultAgreementNumber)
  }
  return calculateCoreLineDeltas(invoiceLines, defaultAgreementNumber)
}

module.exports = {
  calculateLineDeltas
}
