const { EGF00, ERD14 } = require('../../../../app/constants/eu-fund-codes')
const { EXQ00 } = require('../../../../app/constants/domestic-fund-codes')

const { getFundCode } = require('../../../../app/processing/delta/get-fund-code')

let fundCode
let domesticFundCode
let stateAid

describe('get fund code', () => {
  test('should return existing EXQ00 fund code if state aid', async () => {
    fundCode = EXQ00
    domesticFundCode = 'domestic'
    stateAid = true
    const result = getFundCode(fundCode, domesticFundCode, stateAid)
    expect(result).toBe(fundCode)
  })

  test('should replace EGF00 fund code with domestic fund code if not state aid', async () => {
    fundCode = EGF00
    domesticFundCode = 'domestic'
    stateAid = false
    const result = getFundCode(fundCode, domesticFundCode, stateAid)
    expect(result).toBe(domesticFundCode)
  })

  test('should replace ERD14 fund code with domestic fund code if not state aid', async () => {
    fundCode = ERD14
    domesticFundCode = 'domestic'
    stateAid = false
    const result = getFundCode(fundCode, domesticFundCode, stateAid)
    expect(result).toBe(domesticFundCode)
  })

  test('should replace EXQ00 fund code with domestic fund code if not state aid', async () => {
    fundCode = EXQ00
    domesticFundCode = 'domestic'
    stateAid = false
    const result = getFundCode(fundCode, domesticFundCode, stateAid)
    expect(result).toBe(domesticFundCode)
  })
})
