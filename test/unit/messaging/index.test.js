const { MessageReceiver } = require('ffc-messaging')
const { start, stop } = require('../../../app/messaging')
const { messageConfig } = require('../../../app/config')
const { start: startOutbox } = require('../../../app/outbound')

jest.mock('ffc-messaging')
jest.mock('../../../app/outbound')
jest.mock('../../../app/messaging/process-payment-message')
jest.mock('../../../app/messaging/process-acknowledgement-message')
jest.mock('../../../app/messaging/process-return-message')
jest.mock('../../../app/messaging/process-quality-check-message')
jest.mock('../../../app/messaging/process-manual-ledger-check-message')
jest.mock('../../../app/messaging/process-xb-response-message')

describe('Messaging', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    MessageReceiver.mockImplementation(() => ({
      subscribe: jest.fn(),
      closeConnection: jest.fn()
    }))
  })

  describe('start', () => {
    test('creates correct number of payment receivers', async () => {
      await start()
      expect(MessageReceiver).toHaveBeenCalledTimes(
        messageConfig.processingSubscription.numberOfReceivers + 5
      )
    })

    test('subscribes all receivers', async () => {
      await start()
      const mockInstance = MessageReceiver.mock.results[0].value
      expect(mockInstance.subscribe).toHaveBeenCalled()
    })

    test('starts outbox', async () => {
      await start()
      expect(startOutbox).toHaveBeenCalled()
    })

    test('creates acknowledgement receiver', async () => {
      await start()
      expect(MessageReceiver).toHaveBeenCalledWith(
        messageConfig.acknowledgementSubscription,
        expect.any(Function)
      )
    })

    test('creates return receiver', async () => {
      await start()
      expect(MessageReceiver).toHaveBeenCalledWith(
        messageConfig.returnSubscription,
        expect.any(Function)
      )
    })

    test('creates quality check receiver', async () => {
      await start()
      expect(MessageReceiver).toHaveBeenCalledWith(
        messageConfig.qcSubscription,
        expect.any(Function)
      )
    })

    test('creates manual ledger check receiver', async () => {
      await start()
      expect(MessageReceiver).toHaveBeenCalledWith(
        messageConfig.qcManualSubscription,
        expect.any(Function)
      )
    })

    test('creates xb response receiver', async () => {
      await start()
      expect(MessageReceiver).toHaveBeenCalledWith(
        messageConfig.xbResponseSubscription,
        expect.any(Function)
      )
    })

    test('handles subscription error', async () => {
      MessageReceiver.mockImplementation(() => ({
        subscribe: jest.fn().mockRejectedValue(new Error('Test error')),
        closeConnection: jest.fn()
      }))
      await expect(start()).rejects.toThrow('Test error')
    })
  })

  describe('stop', () => {
    test('closes all payment receiver connections', async () => {
      await start()
      await stop()
      const mockInstance = MessageReceiver.mock.results[0].value
      expect(mockInstance.closeConnection).toHaveBeenCalled()
    })

    test('handles close connection error', async () => {
      MessageReceiver.mockImplementation(() => ({
        subscribe: jest.fn(),
        closeConnection: jest.fn().mockRejectedValue(new Error('Test error'))
      }))
      await start()
      await expect(stop()).rejects.toThrow('Test error')
    })
  })
})
