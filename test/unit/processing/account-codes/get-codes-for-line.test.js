jest.mock('../../../../app/processing/is-capital')
const { isCapital: mockIsCapital } = require('../../../../app/processing/is-capital')

const { G00, P24 } = require('../../../../app/constants/line-codes')
const { SFI, CS } = require('../../../../app/constants/schemes')
const sfi = require('../../../../app/processing/account-codes/maps/sfi')
const cs = require('../../../../app/processing/account-codes/maps/cs')

const { getCodesForLine } = require('../../../../app/processing/account-codes/get-codes-for-line')

let accountCodeMap
let schemeId
let lineCode
let schemeCode
let stateAid
let invoiceLine

describe('get codes for line', () => {
  beforeEach(() => {
    mockIsCapital.mockReturnValue(false)

    accountCodeMap = sfi
    schemeId = SFI
    lineCode = G00
    schemeCode = '1234A'
    stateAid = false
    invoiceLine = {
      schemeCode,
      stateAid
    }
  })

  test('should return mapping for line code', () => {
    const result = getCodesForLine(schemeId, lineCode, invoiceLine, accountCodeMap)
    expect(result).toStrictEqual(accountCodeMap[0])
  })

  test('should return undefined if no mapping for line code', () => {
    lineCode = 'XXX'
    const result = getCodesForLine(schemeId, lineCode, invoiceLine, accountCodeMap)
    expect(result).toBeUndefined()
  })

  test('should return capital mapping for CS if capital', () => {
    mockIsCapital.mockReturnValue(true)
    lineCode = P24
    schemeId = CS
    accountCodeMap = cs
    const result = getCodesForLine(schemeId, lineCode, invoiceLine, accountCodeMap)
    expect(result.capital).toBeTruthy()
    expect(result.revenue).toBeFalsy()
  })

  test('should return revenue mapping for CS if not capital', () => {
    mockIsCapital.mockReturnValue(false)
    lineCode = P24
    schemeId = CS
    accountCodeMap = cs
    const result = getCodesForLine(schemeId, lineCode, invoiceLine, accountCodeMap)
    expect(result.revenue).toBeTruthy()
    expect(result.capital).toBeFalsy()
  })
})
