const calculateLineDeltas = (invoiceLines, defaultAgreementNumber) => {
  return [...invoiceLines.reduce((x, y) => {
    // group by line types, so create key representing the combination
    // exclude account code as past requests vary based on ledger
    const key = `${y.schemeCode}-${y.fundCode}-${y.marketingYear}-${y.agreementNumber ?? defaultAgreementNumber}-${y.deliveryBody}-${y.stateAid ?? false}-${y.description}`

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, {
      schemeCode: y.schemeCode,
      fundCode: y.fundCode,
      marketingYear: y.marketingYear,
      agreementNumber: y.agreementNumber ?? defaultAgreementNumber,
      convergence: y.convergence ?? false,
      deliveryBody: y.deliveryBody,
      stateAid: y.stateAid ?? false,
      description: y.description,
      value: 0
    })
    item.convergence = item.convergence || y.convergence
    item.accountCode = item.accountCode || y.current ? y.accountCode : undefined
    item.value += Number(y.value)

    return x.set(key, item)
  }, new Map()).values()].filter(x => x.value !== 0)
}

module.exports = {
  calculateLineDeltas
}
