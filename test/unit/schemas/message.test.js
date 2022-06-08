const Joi = require('joi')

const schema = require('../../../app/data/schemas/message')

let message
let messageSchema

describe('message schema', () => {
  beforeEach(() => {
    messageSchema = Joi.object({ ...schema })
    message = require('../../mockAcknowledged')
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should not return error key when a string date message is given', async () => {
    const { error } = messageSchema.required().validate({ message })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string date message is given and abortEarly is false', async () => {
    const { error } = messageSchema.required().validate({ message },
      {
        abortEarly: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string date message is given and allowUnknown is false', async () => {
    const { error } = messageSchema.required().validate({ message },
      {
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should not return error key when a string date message is given and abortEarly and allowUnknown are false', async () => {
    const { error } = messageSchema.required().validate({ message },
      {
        abortEarly: false,
        allowUnknown: false
      })
    expect(error).toBeUndefined()
  })

  test('should return error key when a numeric message is given', async () => {
    const { error } = messageSchema.required().validate({ message: 12345678901 })
    expect(error).toBeDefined()
  })

  test('should return "Message is invalid" error when a numeric message is given', async () => {
    const { error } = messageSchema.required().validate({ message: 12345678901 })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('Message is invalid')
  })

  test('should return error key when an empty string message is given', async () => {
    const { error } = messageSchema.required().validate({ message: '' })
    expect(error).toBeDefined()
  })

  test('should return "Message is invalid" error when an empty string message is given', async () => {
    const { error } = messageSchema.required().validate({ message: '' })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('Message is invalid')
  })

  test('should return error key when an object message is given', async () => {
    const { error } = messageSchema.required().validate({ message: {} })
    expect(error).toBeDefined()
  })

  test('should return "Message is invalid" error when an object message is given', async () => {
    const { error } = messageSchema.required().validate({ message: {} })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('Message is invalid')
  })

  test('should return error key when an array string message is given', async () => {
    const { error } = messageSchema.required().validate({ message: [] })
    expect(error).toBeDefined()
  })

  test('should return "Message is invalid" error when an array message is given', async () => {
    const { error } = messageSchema.required().validate({ message: [] })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('Message is invalid')
  })

  test('should not return error key when an undefined message is given', async () => {
    const { error } = messageSchema.required().validate({ message: undefined })
    expect(error).toBeUndefined()
  })

  test('should return error key when a null message is given', async () => {
    const { error } = messageSchema.required().validate({ message: null })
    expect(error).toBeDefined()
  })

  test('should return "Message is invalid" error when a null message is given', async () => {
    const { error } = messageSchema.required().validate({ message: null })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('Message is invalid')
  })

  test('should return error key when a true message is given', async () => {
    const { error } = messageSchema.required().validate({ message: true })
    expect(error).toBeDefined()
  })

  test('should return "Message is invalid" error when a true message is given', async () => {
    const { error } = messageSchema.required().validate({ message: true })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('Message is invalid')
  })

  test('should return error key when a false message is given', async () => {
    const { error } = messageSchema.required().validate({ message: false })
    expect(error).toBeDefined()
  })

  test('should return "Message is invalid" error when a false message is given', async () => {
    const { error } = messageSchema.required().validate({ message: false })
    console.log(typeof (error), error, error.details[0].type)
    expect(error.details[0].message).toBe('Message is invalid')
  })
})
