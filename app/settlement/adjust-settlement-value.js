const bpsExchangeRates = require('../constants/bps-exchange-rates')
const { EUR } = require('../constants/currency')
const fdmrExchangeRates = require('../constants/fdmr-exchange-rates')
const { BPS, FDMR } = require('../constants/schemes')
const db = require('../data')

const adjustSettlementValue = async (settlement, completedPaymentRequest) => {
  const { marketingYear, schemeId } = completedPaymentRequest
  if (settlement.currency === EUR) {
    return settlement.value
  }
  let exchangeRate = 1
  if (schemeId === BPS) {
    exchangeRate = bpsExchangeRates[marketingYear] ?? 1
  }
  if (schemeId === FDMR) {
    const invLine = await db.completedInvoiceLine.findOne({
      attributes: ['schemeCode'],
      where: {
        completedPaymentRequestId: completedPaymentRequest.completedPaymentRequestId
      }
    })
    exchangeRate = fdmrExchangeRates[invLine.schemeCode] ?? 1
  }
  return Math.round(settlement.value / exchangeRate)
}

module.exports = {
  adjustSettlementValue
}
