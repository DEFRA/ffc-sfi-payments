const Joi = require('joi')

const schema = require('../../../app/data/schemas/invoice-number')

let invoiceNumber
let invoiceNumberSchema

describe('invoice number schema', () => {
  beforeEach(() => {
    invoiceNumberSchema = Joi.object({ ...schema })
    invoiceNumber = require('../../mockInvoiceNumber')
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should not return error key when a string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string invoiceNumber is given and abortEarly is false', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber },
      {
        abortEarly: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string invoiceNumber is given and allowUnknown is false', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber },
      {
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string invoiceNumber is given and abortEarly and allowUnknown are false', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber },
      {
        abortEarly: false,
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should return error key when a numeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: 12345678901 })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when a numeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: 12345678901 })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })

  test('should return error key when an empty string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '' })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when an empty string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '' })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })

  test('should return error key when an object invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: {} })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when an object invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: {} })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })

  test('should return error key when an array invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: [] })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when an array invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: [] })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })

  test('should return error key when an undefined invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: undefined })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when an undefined invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: undefined })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })

  test('should return error key when a null invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: null })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when a null invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: null })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })

  test('should return error key when a true invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: true })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when a true invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: true })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })

  test('should return error key when a false invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: false })
    expect(error).toBeDefined()
  })

  test('should return "Invoice number is invalid" error when a false invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: false })
    expect(error.details[0].message).toBe('Invoice number is invalid')
  })
})
