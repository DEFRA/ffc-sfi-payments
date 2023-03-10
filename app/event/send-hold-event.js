const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { HOLD_PREFIX } = require('../constants/events')

const sendHoldEvent = async (hold, status) => {
  if (config.useV2Events) {
    await sendV2ResetEvent(hold)
  }
}

const sendV2ResetEvent = async (hold, status) => {
  const event = {
    source: SOURCE,
    type: `${HOLD_PREFIX}.${status}`,
    data: hold
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendHoldEvent
