const { getDefaultAgreementNumber } = require('../../../../app/processing/delta/get-default-agreement-number')

let paymentRequest

describe('get default agreement number', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
  })
})
