const acknowledgementSchema = require('../../../app/acknowledgement/schemas/acknowledgement')

let acknowledgement

describe('acknowledgement schema', () => {
  beforeEach(() => {
    acknowledgement = require('../../mock-acknowledgement-error')
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should not return error key when an acknowledgement is given', async () => {
    const { error } = acknowledgementSchema.required().validate(acknowledgement, { abortEarly: false })
    expect(error).toBeUndefined()
  })

  test('should not return error key when an acknowledgement with only required keys is given', async () => {
    delete acknowledgement.message

    const { error } = acknowledgementSchema.required().validate(acknowledgement, { abortEarly: false })

    expect(error).toBeUndefined()
  })

  test('should return error key when an empty acknowledgement is given', async () => {
    const { error } = acknowledgementSchema.required().validate({}, { abortEarly: false })
    expect(error).toBeDefined()
  })

  test('should return 4 errors when an empty acknowledgement is given', async () => {
    const { error } = acknowledgementSchema.required().validate({}, { abortEarly: false })
    expect(error.details.length).toBe(4)
  })

  test('should return error key when an acknowledgement with only optional keys is given', async () => {
    acknowledgement = { ...acknowledgement.message }

    const { error } = acknowledgementSchema.required().validate({}, { abortEarly: false })
    expect(error).toBeDefined()
  })

  test('should return 4 errors when an acknowledgement with only optional keys is given', async () => {
    acknowledgement = { ...acknowledgement.message }

    const { error } = acknowledgementSchema.required().validate({}, { abortEarly: false })
    expect(error.details.length).toBe(4)
  })
})
