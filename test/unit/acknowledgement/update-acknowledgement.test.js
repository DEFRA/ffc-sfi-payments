jest.mock('../../../app/config')
const mockConfig = require('../../../app/config')

jest.mock('../../../app/acknowledgement/acknowledge-payment-request')
const acknowledgePaymentRequest = require('../../../app/acknowledgement/acknowledge-payment-request')

jest.mock('../../../app/acknowledgement/get-payment-request')
const getPaymentRequest = require('../../../app/acknowledgement/get-payment-request')

jest.mock('../../../app/acknowledgement/process-invalid')
const processInvalid = require('../../../app/acknowledgement/process-invalid')

const updateAcknowledgement = require('../../../app/acknowledgement')
const { SFI } = require('../../../app/schemes')

let mockAcknowledgement
let mockAcknowledgementError

let schemeId
let paymentRequestId

describe('update acknowledgement', () => {
  beforeEach(() => {
    mockConfig.isAlerting = true

    mockAcknowledgement = JSON.parse(JSON.stringify(require('../../mock-acknowledgement')))
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mock-acknowledgement-error')))

    schemeId = SFI
    paymentRequestId = 1

    getPaymentRequest.mockReturnValue({
      schemeId,
      paymentRequestId,
      frn: mockAcknowledgementError.frn
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should not throw when a successful ack object is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).not.toThrow()
  })

  test('should not throw when an unsuccessful ack object is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgementError)
    }
    expect(wrapper).not.toThrow()
  })

  test('should throw when an extra ack object key is given', async () => {
    mockAcknowledgement = {
      ...mockAcknowledgement,
      extra: 'not in schema'
    }

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when an extra ack object key is given', async () => {
    mockAcknowledgement = {
      ...mockAcknowledgement,
      extra: 'not in schema'
    }

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw a "The acknowledgement object is invalid" error when an extra ack object key is given', async () => {
    mockAcknowledgement = {
      ...mockAcknowledgement,
      extra: 'not in schema'
    }

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow(/^The acknowledgement object is invalid/)
  })

  test('should throw when a required ack object key is not given', async () => {
    delete mockAcknowledgement.success

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when a required ack object key is not given', async () => {
    delete mockAcknowledgement.success

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw a "The acknowledgement object is invalid" error when a required ack object key is not given', async () => {
    delete mockAcknowledgement.success

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow(/^The acknowledgement object is invalid/)
  })

  test('should not throw when an optional ack object key is not given', async () => {
    delete mockAcknowledgementError.message

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgementError)
    }

    expect(wrapper).not.toThrow()
  })

  test('should throw when an incorrect ack object value is given', async () => {
    mockAcknowledgement = {
      ...mockAcknowledgement,
      success: 'not a valid value'
    }

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when an incorrect ack object value is given', async () => {
    mockAcknowledgement = {
      ...mockAcknowledgement,
      success: 'not a valid value'
    }

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw a "The acknowledgement object is invalid" error when an incorrect ack object value is given', async () => {
    mockAcknowledgement = {
      ...mockAcknowledgement,
      success: 'not a valid value'
    }

    const wrapper = async () => {
      await updateAcknowledgement(mockAcknowledgement)
    }

    expect(wrapper).rejects.toThrow(/^The acknowledgement object is invalid/)
  })

  test('should throw when an empty ack object is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement({})
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when an empty ack object is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement({})
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw a "The acknowledgement object is invalid" error when an empty ack object is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement({})
    }
    expect(wrapper).rejects.toThrow(/^The acknowledgement object is invalid/)
  })

  test('should throw when undefined is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(undefined)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when undefined is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(undefined)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw a "The acknowledgement object is invalid" error when undefined is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(undefined)
    }
    expect(wrapper).rejects.toThrow(/^The acknowledgement object is invalid/)
  })

  test('should throw when null is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(null)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when null is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(null)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw a "The acknowledgement object is invalid" error when null is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement(null)
    }
    expect(wrapper).rejects.toThrow(/^The acknowledgement object is invalid/)
  })

  test('should throw when an empty string is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement('')
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when an empty string is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement('')
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw a "The acknowledgement object is invalid" error when an empty string is given', async () => {
    const wrapper = async () => {
      await updateAcknowledgement('')
    }
    expect(wrapper).rejects.toThrow(/^The acknowledgement object is invalid/)
  })

  test('should call acknowledgePaymentRequest when a successful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgement)
    expect(acknowledgePaymentRequest).toHaveBeenCalled()
  })

  test('should call acknowledgePaymentRequest once when a successful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgement)
    expect(acknowledgePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call acknowledgePaymentRequest with invoiceNumber and acknowledged when a successful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgement)
    expect(acknowledgePaymentRequest).toHaveBeenCalledWith(mockAcknowledgement.invoiceNumber, mockAcknowledgement.acknowledged)
  })

  test('should call acknowledgePaymentRequest when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(acknowledgePaymentRequest).toHaveBeenCalled()
  })

  test('should call acknowledgePaymentRequest once when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(acknowledgePaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call acknowledgePaymentRequest with invoiceNumber and acknowledged when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(acknowledgePaymentRequest).toHaveBeenCalledWith(mockAcknowledgementError.invoiceNumber, mockAcknowledgementError.acknowledged)
  })

  test('should not call acknowledgePaymentRequest when Joi.validate throws', async () => {
    try {
      await updateAcknowledgement({})
    } catch {}

    expect(acknowledgePaymentRequest).not.toHaveBeenCalled()
  })

  test('should call getPaymentRequest when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(getPaymentRequest).toHaveBeenCalled()
  })

  test('should call getPaymentRequest once when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(getPaymentRequest).toHaveBeenCalledTimes(1)
  })

  test('should call getPaymentRequest with invoiceNumber when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(getPaymentRequest).toHaveBeenCalledWith(mockAcknowledgementError.invoiceNumber)
  })

  test('should not call getPaymentRequest when a successful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgement)
    expect(getPaymentRequest).not.toHaveBeenCalled()
  })

  test('should call processInvalid when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(processInvalid).toHaveBeenCalled()
  })

  test('should call processInvalid once when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(processInvalid).toHaveBeenCalledTimes(1)
  })

  test('should call processInvalid with getPaymentRequest schemeId, paymentRequestId, frn and acknowledgement when an unsuccessful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(processInvalid).toHaveBeenCalledWith(schemeId, paymentRequestId, mockAcknowledgementError.frn, mockAcknowledgementError)
  })

  test('should not call processInvalid when a successful ack object is given', async () => {
    await updateAcknowledgement(mockAcknowledgement)
    expect(processInvalid).not.toHaveBeenCalled()
  })
})
