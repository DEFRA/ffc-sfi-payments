const getFundedLines = (paymentRequest, fundCode, schemeCode) => {
  const euFundedLines = paymentRequest.invoiceLines.filter(x => !x.stateAid && x.fundCode === fundCode && x.value !== 0 && (schemeCode !== undefined ? x.schemeCode === schemeCode : true))
  return { lines: euFundedLines.length, value: euFundedLines.reduce((acc, x) => acc + x.value, 0) }
}

module.exports = {
  getFundedLines
}
