const { convertToPounds } = require('../currency-convert')

const getLedgerLineAP = (invoiceLine, paymentRequest) => {
  return [
    'Ledger',
    invoiceLine.accountCode,
    '',
    invoiceLine.fundCode,
    invoiceLine.schemeCode,
    paymentRequest.marketingYear,
    paymentRequest.deliveryBody,
    paymentRequest.invoiceNumber,
    convertToPounds(invoiceLine.value),
    paymentRequest.currency,
    'legacy',
    '',
    '',
    '',
    '',
    '',
    '',
    invoiceLine.description,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    paymentRequest.agreementNumber,
    '',
    'END'
  ]
}

const getLedgerLineAR = (invoiceLine, paymentRequest) => {
  return getLedgerLineAP(invoiceLine, paymentRequest)
}

module.exports = {
  getLedgerLineAP,
  getLedgerLineAR
}
