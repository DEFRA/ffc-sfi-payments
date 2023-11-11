jest.mock('../../../../app/processing/account-codes/maps')
const { getMap: mockGetMap } = require('../../../../app/processing/account-codes/maps')

jest.mock('../../../../app/processing/account-codes/get-line-code-from-description')
const { getLineCodeFromDescription: mockGetLineCodeFromDescription } = require('../../../../app/processing/account-codes/get-line-code-from-description')

jest.mock('../../../../app/processing/account-codes/get-codes-for-line')
const { getCodesForLine: mockGetCodesForLine } = require('../../../../app/processing/account-codes/get-codes-for-line')

jest.mock('../../../../app/processing/account-codes/select-line-code')
const { selectLineCode: mockSelectLineCode } = require('../../../../app/processing/account-codes/select-line-code')

const { MANUAL } = require('../../../../app/constants/schemes')
const { SFI } = require('../../../../app/constants/schemes')
const { G00 } = require('../../../../app/constants/line-codes')
const { AP } = require('../../../../app/constants/ledgers')
const { ADMINISTRATIVE } = require('../../../../app/constants/debt-types')

const sfiMap = require('../../../../app/processing/account-codes/maps/sfi')

const { mapAccountCodes } = require('../../../../app/processing/account-codes/map-account-codes')

let paymentRequest

describe('map account codes', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = {
      schemeId: SFI,
      ledger: AP,
      debtType: ADMINISTRATIVE,
      invoiceLines: [{
        accountCode: 'existing1',
        stateAid: false
      }, {
        accountCode: 'existing2',
        stateAid: false
      }]
    }

    mockGetMap.mockReturnValue(sfiMap)
    mockGetLineCodeFromDescription.mockReturnValue(G00)
    mockGetCodesForLine.mockReturnValue(sfiMap[0])
    mockSelectLineCode.mockReturnValue(sfiMap[0].ap)
  })

  test('should not map account codes if scheme is manual', () => {
    paymentRequest.schemeId = MANUAL
    mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe('existing1')
  })

  test('should get map for scheme if scheme is not manual', () => {
    mapAccountCodes(paymentRequest)
    expect(mockGetMap).toHaveBeenCalledWith(SFI)
  })

  test('should get line code for invoice line if scheme is not manual', () => {
    mapAccountCodes(paymentRequest)
    expect(mockGetLineCodeFromDescription).toHaveBeenCalledWith(paymentRequest.invoiceLines[0].description)
  })

  test('should get account codes for line if scheme is not manual', () => {
    mapAccountCodes(paymentRequest)
    expect(mockGetCodesForLine).toHaveBeenCalledWith(SFI, G00, paymentRequest.invoiceLines[0], sfiMap)
  })

  test('should select line code if scheme is not manual', () => {
    mapAccountCodes(paymentRequest)
    expect(mockSelectLineCode).toHaveBeenCalledTimes(2)
  })

  test('should map account code if scheme is not manual', () => {
    mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[0].accountCode).toBe(sfiMap[0].ap)
  })

  test('should map account code for each invoice line if scheme is not manual', () => {
    mapAccountCodes(paymentRequest)
    expect(paymentRequest.invoiceLines[1].accountCode).toBe(sfiMap[0].ap)
  })
})
