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

  test('should not return error key when a 21 alphanumeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a 21 alphanumeric invoiceNumber is given and abortEarly is false', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber },
      {
        abortEarly: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a 21 alphanumeric invoiceNumber is given and allowUnknown is false', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber },
      {
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a 21 alphanumeric invoiceNumber is given and abortEarly and allowUnknown are false', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber },
      {
        abortEarly: false,
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should return error key when a 20 alphanumeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: invoiceNumber.slice(0, 20) })
    expect(error).toBeDefined()
  })

  test('should throw string.pattern.base error when a 20 alphanumeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: invoiceNumber.slice(0, 20) })
    expect(error.details[0].type).toBe('string.pattern.base')
  })

  test('should return "The invoice number is too short, it must be 21 characters" error when a 20 alphanumeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: invoiceNumber.slice(0, 20) })
    expect(error.details[0].message).toBe('The invoice number is too short, it must be 21 characters')
  })

  test('should return error key when an 22 alphanumeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: invoiceNumber + 'A' })
    expect(error).toBeDefined()
  })

  test('should throw string.pattern.base error when an 22 alphanumeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: invoiceNumber + 'A' })
    expect(error.details[0].type).toBe('string.pattern.base')
  })

  test('should return "The invoice number is too long, it must be 21 characters" error when an 22 alphanumeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: invoiceNumber + 'A' })
    expect(error.details[0].message).toBe('The invoice number is too long, it must be 21 characters')
  })

  test('should return error key when a numeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: 12345 })
    expect(error).toBeDefined()
  })

  test('should throw string.base error when a numeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: 12345 })
    expect(error.details[0].type).toBe('string.base')
  })

  test('should return "The invoice number can only have alphanumeric characters" error when a numeric invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: 12345 })
    expect(error.details[0].message).toBe('The invoice number can only have alphanumeric characters')
  })

  test('should return error key when an empty string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '' })
    expect(error).toBeDefined()
  })

  test('should throw string.empty error when an empty string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '' })
    expect(error.details[0].type).toBe('string.empty')
  })

  test('should return "The invoice number cannot be empty, it must be 21 characters" error when an empty string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '' })
    expect(error.details[0].message).toBe('The invoice number cannot be empty')
  })

  test('should return error key when a non-alphanumeric string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '123madeup-ivnumber456' })
    expect(error).toBeDefined()
  })

  test('should throw string.pattern.base error when a non-alphanumeric string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '123madeup-ivnumber456' })
    expect(error.details[0].type).toBe('string.pattern.base')
  })

  test('should return "The invoice number can only have alphanumeric characters" error when a non-alphanumeric string invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: '123madeup-ivnumber456' })
    expect(error.details[0].message).toBe('The invoice number can only have alphanumeric characters')
  })

  test('should return error key when an object invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: {} })
    expect(error).toBeDefined()
  })

  test('should throw string.base error when an object invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: {} })
    expect(error.details[0].type).toBe('string.base')
  })

  test('should return "The invoice number can only have alphanumeric characters" error when an object invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: {} })
    expect(error.details[0].message).toBe('The invoice number can only have alphanumeric characters')
  })

  test('should return error key when an array invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: [] })
    expect(error).toBeDefined()
  })

  test('should throw string.base error when an array invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: [] })
    expect(error.details[0].type).toBe('string.base')
  })

  test('should return "The invoice number can only have alphanumeric characters" error when an array invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: [] })
    expect(error.details[0].message).toBe('The invoice number can only have alphanumeric characters')
  })

  test('should return error key when an undefined invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: undefined })
    expect(error).toBeDefined()
  })

  test('should throw any.required error when an undefined invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: undefined })
    expect(error.details[0].type).toBe('any.required')
  })

  test('should return "The invoice number is invalid" error when an undefined invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: undefined })
    expect(error.details[0].message).toBe('The invoice number is invalid')
  })

  test('should return error key when a null invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: null })
    expect(error).toBeDefined()
  })

  test('should throw string.base error when a null invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: null })
    expect(error.details[0].type).toBe('string.base')
  })

  test('should return "The invoice number can only have alphanumeric characters" error when a null invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: null })
    expect(error.details[0].message).toBe('The invoice number can only have alphanumeric characters')
  })

  test('should return error key when a true invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: true })
    expect(error).toBeDefined()
  })

  test('should throw string.base error when a true invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: true })
    expect(error.details[0].type).toBe('string.base')
  })

  test('should return "The invoice number can only have alphanumeric characters" error when a true invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: true })
    expect(error.details[0].message).toBe('The invoice number can only have alphanumeric characters')
  })

  test('should return error key when a false invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: false })
    expect(error).toBeDefined()
  })

  test('should throw string.base error when a false invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: false })
    expect(error.details[0].type).toBe('string.base')
  })

  test('should return "The invoice number can only have alphanumeric characters" error when a false invoiceNumber is given', async () => {
    const { error } = invoiceNumberSchema.required().validate({ invoiceNumber: false })
    expect(error.details[0].message).toBe('The invoice number can only have alphanumeric characters')
  })
})
