jest.mock('../../../app/processing/transform-payment-request')
const { transformPaymentRequest: mockTransformPaymentRequest } = require('../../../app/processing/transform-payment-request')

jest.mock('../../../app/processing/auto-hold')
const { applyAutoHold: mockApplyAutoHold } = require('../../../app/processing/auto-hold')

jest.mock('../../../app/processing/requires-debt-data')
const { requiresDebtData: mockRequiresDebtData } = require('../../../app/processing/requires-debt-data')

jest.mock('../../../app/processing/routing')
const { routeDebtToRequestEditor: mockRouteDebtToRequestEditor, routeManualLedgerToRequestEditor: mockRouteManualLedgerToRequestEditor } = require('../../../app/processing/routing')

jest.mock('../../../app/processing/requires-manual-ledger-check')
const { requiresManualLedgerCheck: mockRequiresManualLedgerCheck } = require('../../../app/processing/requires-manual-ledger-check')

jest.mock('../../../app/processing/account-codes')
const { mapAccountCodes: mockMapAccountCodes } = require('../../../app/processing/account-codes')

jest.mock('../../../app/processing/complete-payment-requests')
const { completePaymentRequests: mockCompletePaymentRequests } = require('../../../app/processing/complete-payment-requests')

jest.mock('../../../app/processing/event')
const { sendProcessingRouteEvent: mockSendProcessingRouteEvent } = require('../../../app/processing/event')

const { MANUAL, ES, IMPS, FC } = require('../../../app/processing/constants/schemes')

const { processPaymentRequest } = require('../../../app/processing/process-payment-request')

const scheduleId = 1

let paymentRequest
let scheduledPaymentRequest

describe('process payment request', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-requests/payment-request')))
    scheduledPaymentRequest = {
      paymentRequest,
      scheduleId
    }
  })

  test('manual payments should complete payment request without further processing', async () => {
    paymentRequest.schemeId = MANUAL
    await processPaymentRequest(scheduledPaymentRequest)
    expect(mockCompletePaymentRequests).toHaveBeenCalledWith(scheduleId, [paymentRequest])
  })
})
