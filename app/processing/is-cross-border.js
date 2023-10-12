const { CROSS_BORDER } = require('../constants/delivery-bodies')

const isCrossBorder = (invoiceLines = []) => {
  return invoiceLines.some(x => x.deliveryBody === CROSS_BORDER)
}

module.exports = {
  isCrossBorder
}
