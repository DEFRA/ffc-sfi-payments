const settlement = require('../../mocks/settlements/settlement')
const esSettlement = require('../../mocks/settlements/es')
const fcSettlement = require('../../mocks/settlements/fc')
const impsSettlement = require('../../mocks/settlements/imps')

const { ES, FC, IMPS } = require('../../../app/constants/schemes')

const { getSettlementFilter } = require('../../../app/settlement/get-settlement-filter')

describe('get settlement filter', () => {
  test('should return default filter if source system is not Genesis, GLOS or IMPS', () => {
    const filter = getSettlementFilter(settlement)
    expect(filter).toEqual({
      invoiceNumber: settlement.invoiceNumber
    })
  })

  test('should return ES filter if source system is Genesis', () => {
    const filter = getSettlementFilter(esSettlement)
    expect(filter).toEqual({
      schemeId: ES,
      agreementNumber: esSettlement.transactionNumber
    })
  })

  test('should return FC filter if source system is GLOS', () => {
    const filter = getSettlementFilter(fcSettlement)
    expect(filter).toEqual({
      schemeId: FC,
      frn: fcSettlement.frn,
      contractNumber: fcSettlement.claimNumber,
      agreementNumber: fcSettlement.agreementNumber
    })
  })

  test('should return IMPS filter if source system is IMPS', () => {
    const filter = getSettlementFilter(impsSettlement)
    expect(filter).toEqual({
      schemeId: IMPS,
      invoiceNumber: impsSettlement.transactionNumber
    })
  })
})
