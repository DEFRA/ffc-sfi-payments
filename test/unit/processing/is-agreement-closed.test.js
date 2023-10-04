const { resetDatabase, closeDatabaseConnection } = require('../../helpers')
const { isAgreementClosed } = require('../../../app/processing/is-agreement-closed')
const { closureDBEntry } = require('../../mocks/closure/closure-db-entry')
const db = require('../../../app/data')
const { BPS } = require('../../../app/constants/schemes')
const { FRN } = require('../../mocks/values/frn')
const { FUTURE_DATE } = require('../../mocks/values/future-date')

let paymentRequest

describe('is agreement closed', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()

    paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-requests/payment-request')))
    paymentRequest.value = 0
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })

  test('should return true if the closure is raised with date in the past', async () => {
    // set up closures DB
    await db.frnAgreementClosed.create(closureDBEntry)

    expect(await isAgreementClosed(paymentRequest)).toBe(true)
  })

  test('should return false if no closure has been created', async () => {
    expect(await isAgreementClosed(paymentRequest)).toBe(false)
  })

  test('should return false if a closure with different scheme has been created', async () => {
    // set up closures DB
    closureDBEntry.schemeId = BPS
    await db.frnAgreementClosed.create(closureDBEntry)

    paymentRequest.value = 1000
    expect(await isAgreementClosed(paymentRequest)).toBe(false)
  })

  test('should return false if a closure with different FRN has been created', async () => {
    // set up closures DB
    closureDBEntry.frn = FRN + 1
    await db.frnAgreementClosed.create(closureDBEntry)

    paymentRequest.value = 1000
    expect(await isAgreementClosed(paymentRequest)).toBe(false)
  })

  test('should return false if a closure with different agreement number has been created', async () => {
    // set up closures DB
    closureDBEntry.agreementNumber = 'SIP00000000002'
    await db.frnAgreementClosed.create(closureDBEntry)

    paymentRequest.value = 1000
    expect(await isAgreementClosed(paymentRequest)).toBe(false)
  })

  test('should return false if a closure is raised but date has not passed', async () => {
    // set up closures DB
    closureDBEntry.closureDate = FUTURE_DATE
    await db.frnAgreementClosed.create(closureDBEntry)

    paymentRequest.value = 1000
    expect(await isAgreementClosed(paymentRequest)).toBe(false)
  })

  test('should return false if the value is non-zero', async () => {
    // set up closures DB
    await db.frnAgreementClosed.create(closureDBEntry)

    paymentRequest.value = 1000
    expect(await isAgreementClosed(paymentRequest)).toBe(false)
  })
})
