const paymentRequestSchema = require('../../../../app/inbound/schemas/payment-request')
let paymentRequest

describe('payment request validation', () => {
  beforeEach(async () => {
    paymentRequest = {
      schemeId: 1,
      sourceSystem: 'SFIP',
      deliveryBody: 'RP00',
      invoiceNumber: 'SFI00000001',
      frn: 1234567890,
      sbi: 123456789,
      paymentRequestNumber: 1,
      agreementNumber: 'SIP00000000000001',
      contractNumber: 'SFIP000001',
      marketingYear: 2022,
      currency: 'GBP',
      schedule: 'M12',
      dueDate: '2021-08-15',
      value: 150.00,
      invoiceLines: [{
        standardCode: '80001',
        accountCode: 'SOS273',
        fundCode: 'DRD10',
        description: 'G00 - Gross value of claim',
        value: 250.00
      },
      {
        standardCode: '80001',
        accountCode: 'SOS273',
        fundCode: 'DRD10',
        description: 'P02 - Over declaration penalty',
        value: -100.00
      }]
    }
  })

  test('should validate payment request', async () => {
    const validationResult = await paymentRequestSchema.validate(paymentRequest)

    expect(validationResult.error).toBe(undefined)
  })

  test('should error to validate empty payment request', async () => {
    paymentRequest = {}

    const validationResult = await paymentRequestSchema.validate(paymentRequest)

    expect(validationResult.error).toBeDefined()
  })

  test('should error to validate payment request without invoice lines', async () => {
    paymentRequest = {
      schemeId: 1,
      sourceSystem: 'SFIP',
      deliveryBody: 'RP00',
      invoiceNumber: 'SFI00000001',
      frn: 1234567890,
      sbi: 123456789,
      paymentRequestNumber: 1,
      agreementNumber: 'SIP00000000000001',
      contractNumber: 'SFIP000001',
      marketingYear: 2022,
      currency: 'GBP',
      schedule: 'M12',
      dueDate: '2021-08-15',
      value: 400.00
    }

    const validationResult = await paymentRequestSchema.validate(paymentRequest)

    expect(validationResult.error.message).toBe('"invoiceLines" is required')
  })

  test('should error to validate payment request with invalid numeric data types', async () => {
    paymentRequest = {
      schemeId: 1,
      sourceSystem: 3424,
      deliveryBody: 'RP00',
      invoiceNumber: 'SFI00000001',
      frn: 1234567890,
      sbi: 123456789,
      paymentRequestNumber: 1,
      agreementNumber: 'SIP00000000000001',
      contractNumber: 'SFIP000001',
      marketingYear: 2022,
      currency: 'GBP',
      schedule: 'M12',
      dueDate: '2021-08-15',
      value: 400.00
    }

    const validationResult = await paymentRequestSchema.validate(paymentRequest)

    expect(validationResult.error.message).toBe('"sourceSystem" must be a string')
  })

  test('should error to validate payment request with invalid string data types', async () => {
    paymentRequest = {
      schemeId: 1,
      sourceSystem: 'SFIP',
      deliveryBody: 'RP00',
      invoiceNumber: 'SFI00000001',
      frn: 1234567890,
      sbi: 'ewqeq',
      paymentRequestNumber: 1,
      agreementNumber: 'SIP00000000000001',
      contractNumber: 'SFIP000001',
      marketingYear: 2022,
      currency: 'GBP',
      schedule: 'M12',
      dueDate: '2021-08-15',
      value: '3242',
      invoiceLines: [
        {
          standardCode: '80001',
          accountCode: 'SOS273',
          fundCode: 'DRD10',
          description: 'G00 - Gross value of claim',
          value: 250.00
        },
        {
          standardCode: '80001',
          accountCode: 'SOS273',
          fundCode: 'DRD10',
          description: 'P02 - Over declaration penalty',
          value: -100.00
        }
      ]
    }

    const validationResult = await paymentRequestSchema.validate(paymentRequest)

    expect(validationResult.error.message).toBe('"sbi" must be a number')
  })
})
