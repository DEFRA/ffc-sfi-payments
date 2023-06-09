const { AP, AR } = require('../../../../app/constants/ledgers')
const { ADMINISTRATIVE, IRREGULAR } = require('../../../../app/constants/debt-types')

const { selectLineCode } = require('../../../../app/processing/account-codes/select-line-code')

const accountCodes = require('../../../../app/processing/account-codes/maps/sfi')

let ledger
let debtType
let stateAid
let currentAccountCode

describe('select line code', () => {
  beforeEach(() => {
    ledger = AP
    debtType = undefined
    stateAid = false
    currentAccountCode = 'existing'
  })

  test('should return AP code if ledger is AP', () => {
    const result = selectLineCode(accountCodes, ledger, debtType, stateAid, currentAccountCode)
    expect(result).toBe(accountCodes.ap)
  })

  test('should return current AP code if ledger is AP and is state aid', () => {
    stateAid = true
    const result = selectLineCode(accountCodes, ledger, debtType, stateAid, currentAccountCode)
    expect(result).toBe(currentAccountCode)
  })

  test('should return AR admin code if ledger is AR and debt type is administrative', () => {
    ledger = AR
    debtType = ADMINISTRATIVE
    const result = selectLineCode(accountCodes, ledger, debtType, stateAid, currentAccountCode)
    expect(result).toBe(accountCodes.arAdmin)
  })

  test('should return AR irregular code if ledger is AR and debt type is irregular', () => {
    ledger = AR
    debtType = IRREGULAR
    const result = selectLineCode(accountCodes, ledger, debtType, stateAid, currentAccountCode)
    expect(result).toBe(accountCodes.arIrregular)
  })
})
