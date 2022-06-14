const createSplitInvoiceNumber = (invoiceNumber, splitId, schemeId) => {
  switch (schemeId) {
    case 1:
    case 2:
    case 3:
      return createSitiAgriInvoiceNumber(invoiceNumber, splitId)
    default:
      return createDefaultInvoiceNumber(invoiceNumber, splitId)
  }
}

const createSitiAgriInvoiceNumber = (invoiceNumber, splitId) => {
  // an invoice number is a string made up of three elements, to inject a split id character into the string we need to identify the position of those elements
  // we also need to trim the first character of the final element
  const firstElementLength = 8
  const finalElementLength = 3
  return `${invoiceNumber.slice(0, firstElementLength)}${splitId}${invoiceNumber.slice(firstElementLength, invoiceNumber.length - finalElementLength)}${invoiceNumber.slice(invoiceNumber.length - finalElementLength + 1)}`
}

const createDefaultInvoiceNumber = (invoiceNumber, splitId) => {
  // an invoice number is a string made up of two elements, to inject a split id character into the string we need to identify the position of those elements
  // we also need to trim the first character of the final element
  const finalElementLength = 3
  return `${invoiceNumber.slice(0, invoiceNumber.length - finalElementLength - 1)}${splitId}${invoiceNumber.slice(invoiceNumber.length - finalElementLength - 1, invoiceNumber.length - finalElementLength)}${invoiceNumber.slice(invoiceNumber.length - finalElementLength + 1)}`
}

module.exports = createSplitInvoiceNumber
