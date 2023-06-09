const { calculateCoreLineDeltas } = require('./calculate-core-line-deltas')

const calculateLineDeltas = (invoiceLines, defaultAgreementNumber) => {
  return calculateCoreLineDeltas(invoiceLines, defaultAgreementNumber)
}

module.exports = {
  calculateLineDeltas
}
