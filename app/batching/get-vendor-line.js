const moment = require('moment')
const { convertToPounds } = require('../currency-convert')

const getVendorLineAP = (paymentRequest, vendorGroup, batch) => {
  return [
    'Vendor',
    paymentRequest.frn,
    '',
    vendorGroup.fundCode,
    vendorGroup.schemeCode,
    paymentRequest.marketingYear,
    paymentRequest.deliveryBody,
    paymentRequest.invoiceNumber,
    convertToPounds(vendorGroup.value),
    paymentRequest.currency,
    'legacy',
    '',
    paymentRequest.contractNumber,
    '',
    1,
    '',
    '',
    '',
    '',
    `BACS_${paymentRequest.currency}`,
    batch.scheme.batchProperties.source,
    '',
    '',
    '',
    moment(paymentRequest.dueDate).format('DD[/]MM[/]YYYY'),
    paymentRequest.currency,
    '',
    '',
    paymentRequest.schedule,
    'END'
  ]
}

const getVendorLineAR = (paymentRequest, vendorGroup, batch) => {
  return getVendorLineAP(paymentRequest, vendorGroup, batch)
}

module.exports = {
  getVendorLineAP,
  getVendorLineAR
}
