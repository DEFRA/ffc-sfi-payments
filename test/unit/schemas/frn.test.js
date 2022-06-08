const Joi = require('joi')

const schema = require('../../../app/data/schemas/frn')

let frn
let frnSchema

describe('frn schema', () => {
  beforeEach(() => {
    frnSchema = Joi.object({ ...schema })
    frn = require('../../mockFrn')
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should not return error key when a 10 digit frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a 10 digit frn is given and abortEarly is false', async () => {
    const { error } = frnSchema.required().validate({ frn },
      {
        abortEarly: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a 10 digit frn is given and allowUnknown is false', async () => {
    const { error } = frnSchema.required().validate({ frn },
      {
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a 10 digit frn is given and abortEarly and allowUnknown are false', async () => {
    const { error } = frnSchema.required().validate({ frn },
      {
        abortEarly: false,
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should return error key when an 9 digit frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 123456789 })
    expect(error).toBeDefined()
  })

  test('should throw number.min error when an 9 digit frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 123456789 })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.min')
  })

  test('should return "The FRN is too short, it must be 10 digits" error when an 9 digit frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 123456789 })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN is too short, it must be 10 digits')
  })

  test('should return error key when an 11 digit frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 12345678901 })
    expect(error).toBeDefined()
  })

  test('should throw number.max error when an 11 digit frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 12345678901 })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.max')
  })

  test('should return "The FRN is too long, it must be 10 digits" error when an 11 digit frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 12345678901 })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN is too long, it must be 10 digits')
  })

  test('should return error key when an alphanumeric frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 'abcdef7890' })
    expect(error).toBeDefined()
  })

  test('should throw number.base error when an alphanumeric frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 'abcdef7890' })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.base')
  })

  test('should return "The FRN must be a 10 digit number" error when an alphanumeric frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 'abcdef7890' })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN must be a 10 digit number')
  })

  test('should not return error key when a parseable alphanumeric frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: frn.toString() })
    expect(error).toBeUndefined()
  })

  test('should return error key when an empty string frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: '' })
    expect(error).toBeDefined()
  })

  test('should throw number.base error when an empty string frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: '' })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.base')
  })

  test('should return "The FRN must be a 10 digit number" error when an empty string frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: '' })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN must be a 10 digit number')
  })

  test('should return error key when an object frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: {} })
    expect(error).toBeDefined()
  })

  test('should throw number.base error when an object frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: {} })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.base')
  })

  test('should return "The FRN must be a 10 digit number" error when an object frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: {} })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN must be a 10 digit number')
  })

  test('should return error key when an array frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: [] })
    expect(error).toBeDefined()
  })

  test('should throw number.base error when an array frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: [] })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.base')
  })

  test('should return "The FRN must be a 10 digit number" error when an array frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: [] })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN must be a 10 digit number')
  })

  test('should return error key when an undefined frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: undefined })
    expect(error).toBeDefined()
  })

  test('should throw any.required error when an undefined frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: undefined })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('any.required')
  })

  test('should return "The FRN is invalid, it must be 10 digits" error when an undefined frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: undefined })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN is invalid, it must be 10 digits')
  })

  test('should return error key when a null frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: null })
    expect(error).toBeDefined()
  })

  test('should throw any.required error when a null frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: null })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.base')
  })

  test('should return "The FRN must be a 10 digit number" error when a null frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: null })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN must be a 10 digit number')
  })

  test('should return error key when a true frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: true })
    expect(error).toBeDefined()
  })

  test('should throw any.required error when a true frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: true })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.base')
  })

  test('should return "The FRN must be a 10 digit number" error when a true frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: true })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN must be a 10 digit number')
  })

  test('should return error key when a false frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: false })
    expect(error).toBeDefined()
  })

  test('should throw any.required error when a false frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: false })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.base')
  })

  test('should return "The FRN must be a 10 digit number" error when a false frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: false })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN must be a 10 digit number')
  })

  test('should return error key when a large, unsafe frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 90071992547409924 })
    expect(error).toBeDefined()
  })

  test('should throw any.required error when a false frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 90071992547409924 })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].type).toBe('number.unsafe')
  })

  test('should return "The FRN is too long, it must be 10 digits" error when a false frn is given', async () => {
    const { error } = frnSchema.required().validate({ frn: 90071992547409924 })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('The FRN is too long, it must be 10 digits')
  })
})
