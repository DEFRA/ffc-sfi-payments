const { SFI, LUMP_SUMS, SFI_PILOT } = require('../../constants/schemes')
const { createDefaultInvoiceNumber } = require('./create-default-invoice-number')
const { createSitiAgriInvoiceNumber } = require('./create-siti-agri-invoice-number')

const createSplitInvoiceNumber = (invoiceNumber, splitId, schemeId) => {
  switch (schemeId) {
    case SFI:
    case SFI_PILOT:
    case LUMP_SUMS:
      return createSitiAgriInvoiceNumber(invoiceNumber, splitId)
    default:
      return createDefaultInvoiceNumber(invoiceNumber, splitId)
  }
}

module.exports = {
  createSplitInvoiceNumber
}
