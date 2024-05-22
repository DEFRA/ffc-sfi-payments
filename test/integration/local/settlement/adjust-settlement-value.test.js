const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

const { adjustSettlementValue } = require('../../../../app/settlement/adjust-settlement-value')

const { BPS, FDMR } = require('../../../../app/constants/schemes')
const { EUR } = require('../../../../app/constants/currency')
const bpsExchangeRates = require('../../../../app/constants/bps-exchange-rates')
const fdmrExchangeRates = require('../../../../app/constants/fdmr-exchange-rates')

let settlement
let bpsPaymentRequest
let fdmrPaymentRequest

describe('adjust settlement value', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()

    settlement = JSON.parse(JSON.stringify(require('../../../mocks/settlements/settlement')))
    bpsPaymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    bpsPaymentRequest.schemeId = BPS
    fdmrPaymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    fdmrPaymentRequest.schemeId = FDMR
    fdmrPaymentRequest.invoiceLines[0].schemeCode = 10575
  })

  test('should return the settlement value if settlement currency is EUR', async () => {
    settlement.currency = EUR
    const result = await adjustSettlementValue(settlement, bpsPaymentRequest)
    expect(result).toBe(settlement.value)
  })

  test('should return the correct exchange rate based on marketing year for GBP settlement, BPS scheme', async () => {
    bpsPaymentRequest.marketingYear = 2015
    const expectedResult = Math.round(settlement.value / bpsExchangeRates[bpsPaymentRequest.marketingYear])
    const result = await adjustSettlementValue(settlement, bpsPaymentRequest)
    expect(result).toBe(expectedResult)
  })

  test('should return the settlement value if marketingYear not found in exchange rates file, BPS scheme', async () => {
    bpsPaymentRequest.marketingYear = 2022
    const result = await adjustSettlementValue(settlement, bpsPaymentRequest)
    expect(result).toBe(settlement.value)
  })

  test('should return the correct exchange rate based on scheme code for GBP settlement, FDMR scheme', async () => {
    const savedPR = await savePaymentRequest(fdmrPaymentRequest, true)
    fdmrPaymentRequest.completedPaymentRequestId = savedPR.completedId
    const expectedResult = Math.round(settlement.value / fdmrExchangeRates[fdmrPaymentRequest.invoiceLines[0].schemeCode])
    const result = await adjustSettlementValue(settlement, fdmrPaymentRequest)
    expect(result).toBe(expectedResult)
  })

  test('should return the settlement value if scheme code not found in exchange rates file, FDMR scheme', async () => {
    fdmrPaymentRequest.invoiceLines[0].schemeCode = 99213
    const savedPR = await savePaymentRequest(fdmrPaymentRequest, true)
    fdmrPaymentRequest.completedPaymentRequestId = savedPR.completedId
    const result = await adjustSettlementValue(settlement, fdmrPaymentRequest)
    expect(result).toBe(settlement.value)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
