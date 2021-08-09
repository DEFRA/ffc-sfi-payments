const { convertToPence } = require('../../currency-convert')
const getSchemeCode = require('../get-scheme-code')

const enrichInvoiceLine = async (invoiceLine, transaction, fundCode) => {
  invoiceLine.value = convertToPence(invoiceLine.value)
  invoiceLine.schemeCode = await getSchemeCode(invoiceLine.standardCode, transaction)
  invoiceLine.fundCode = fundCode
}

module.exports = enrichInvoiceLine
