const Joi = require('joi')

const schema = require('../../../app/schemas/acknowledged')

let acknowledged
let acknowledgedSchema

describe('acknowledged schema', () => {
  beforeEach(() => {
    acknowledgedSchema = Joi.object({ ...schema })
    acknowledged = require('../../mock-acknowledged')
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should not return error key when a string date acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string date acknowledged is given and abortEarly is false', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged },
      {
        abortEarly: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string date acknowledged is given and allowUnknown is false', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged },
      {
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string date acknowledged is given and abortEarly and allowUnknown are false', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged },
      {
        abortEarly: false,
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should return error key when a numeric acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: 12345678901 })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when a numeric acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: 12345678901 })
    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })

  test('should return error key when an empty string acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: '' })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when an empty string acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: '' })
    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })

  test('should return error key when an object acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: {} })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when an object acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: {} })

    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })

  test('should return error key when an array acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: [] })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when an array acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: [] })

    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })

  test('should return error key when an undefined acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: undefined })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when an undefined acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: undefined })
    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })
  test('should return error key when a null acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: null })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when a null acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: null })
    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })

  test('should return error key when a true acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: true })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when a true acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: true })
    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })

  test('should return error key when a false acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: false })
    expect(error).toBeDefined()
  })

  test('should return "Acknowledged is invalid" error when a false acknowledged is given', async () => {
    const { error } = acknowledgedSchema.required().validate({ acknowledged: false })
    expect(error.details[0].message).toBe('Acknowledged is invalid')
  })
})
