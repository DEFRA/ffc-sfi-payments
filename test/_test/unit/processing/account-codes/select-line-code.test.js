const { AP, AR } = require('../../../../../app/constants/ledgers')
const { ADMINISTRATIVE, IRREGULAR } = require('../../../../../app/constants/debt-types')

const { selectLineCode } = require('../../../../../app/processing/account-codes/select-line-code')

const accountCodes = require('../../../../../app/processing/account-codes/maps/sfi')

let ledger
let debtType

describe('select line code', () => {
  beforeEach(() => {
    ledger = AP
    debtType = undefined
  })

  test('should return AP code if ledger is AP', () => {
    const result = selectLineCode(accountCodes, ledger, debtType)
    expect(result).toBe(accountCodes.ap)
  })

  test('should return AR admin code if ledger is AR and debt type is administrative', () => {
    ledger = AR
    debtType = ADMINISTRATIVE
    const result = selectLineCode(accountCodes, ledger, debtType)
    expect(result).toBe(accountCodes.arAdmin)
  })

  test('should return AR irregular code if ledger is AR and debt type is irregular', () => {
    ledger = AR
    debtType = IRREGULAR
    const result = selectLineCode(accountCodes, ledger, debtType)
    expect(result).toBe(accountCodes.arIrregular)
  })
})
