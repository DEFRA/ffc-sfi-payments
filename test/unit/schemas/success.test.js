const Joi = require('joi')

const schema = require('../../../app/data/schemas/success')

let success
let successSchema

describe('success schema', () => {
  beforeEach(() => {
    successSchema = Joi.object({ ...schema })
    success = require('../../mockSuccess')
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should not return error key when a true success is given', async () => {
    const { error } = successSchema.required().validate({ success })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a true success is given and abortEarly is false', async () => {
    const { error } = successSchema.required().validate({ success },
      {
        abortEarly: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a true success is given and allowUnknown is false', async () => {
    const { error } = successSchema.required().validate({ success },
      {
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a true success is given and abortEarly and allowUnknown are false', async () => {
    const { error } = successSchema.required().validate({ success },
      {
        abortEarly: false,
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a false success is given', async () => {
    const { error } = successSchema.required().validate({ success: false })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a false success is given and abortEarly is false', async () => {
    const { error } = successSchema.required().validate({ success: false },
      {
        abortEarly: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a false success is given and allowUnknown is false', async () => {
    const { error } = successSchema.required().validate({ success: false },
      {
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a false success is given and abortEarly and allowUnknown are false', async () => {
    const { error } = successSchema.required().validate({ success: false },
      {
        abortEarly: false,
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string true success is given', async () => {
    const { error } = successSchema.required().validate({ success: 'true' })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string false success is given', async () => {
    const { error } = successSchema.required().validate({ success: 'false' })
    expect(error).toBeUndefined()
  })

  test('should return error key when a 1 success is given', async () => {
    const { error } = successSchema.required().validate({ success: 1 })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when a 1 success is given', async () => {
    const { error } = successSchema.required().validate({ success: 1 })
    expect(error.details[0].message).toBe('Success must be true or false')
  })

  test('should return error key when a 0 success is given', async () => {
    const { error } = successSchema.required().validate({ success: 0 })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when a 0 success is given', async () => {
    const { error } = successSchema.required().validate({ success: 0 })
    expect(error.details[0].message).toBe('Success must be true or false')
  })

  test('should return error key when a numeric success is given', async () => {
    const { error } = successSchema.required().validate({ success: 12345 })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when a numeric success is given', async () => {
    const { error } = successSchema.required().validate({ success: 12345 })
    expect(error.details[0].message).toBe('Success must be true or false')
  })

  test('should return error key when an empty string success is given', async () => {
    const { error } = successSchema.required().validate({ success: '' })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when an empty string success is given', async () => {
    const { error } = successSchema.required().validate({ success: '' })
    expect(error.details[0].message).toBe('Success must be true or false')
  })

  test('should return error key when an object success is given', async () => {
    const { error } = successSchema.required().validate({ success: {} })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when an object success is given', async () => {
    const { error } = successSchema.required().validate({ success: {} })
    expect(error.details[0].message).toBe('Success must be true or false')
  })

  test('should return error key when an array success is given', async () => {
    const { error } = successSchema.required().validate({ success: [] })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when an array success is given', async () => {
    const { error } = successSchema.required().validate({ success: [] })
    console.log(error)
    expect(error.details[0].message).toBe('Success must be true or false')
  })

  test('should return error key when an undefined success is given', async () => {
    const { error } = successSchema.required().validate({ success: undefined })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when an undefined success is given', async () => {
    const { error } = successSchema.required().validate({ success: undefined })
    expect(error.details[0].message).toBe('Success must be true or false')
  })

  test('should return error key when a null success is given', async () => {
    const { error } = successSchema.required().validate({ success: null })
    expect(error).toBeDefined()
  })

  test('should return "Success must be true or false" error when a null success is given', async () => {
    const { error } = successSchema.required().validate({ success: null })
    expect(error.details[0].message).toBe('Success must be true or false')
  })
})
