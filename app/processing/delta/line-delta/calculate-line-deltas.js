const { calculateCoreLineDeltas } = require('../calculate-line-deltas')

const calculateLineDeltas = (invoiceLines, defaultAgreementNumber) => {
  return calculateCoreLineDeltas(invoiceLines, defaultAgreementNumber)
}

module.exports = {
  calculateLineDeltas
}
