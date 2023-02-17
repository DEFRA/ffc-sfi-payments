const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendHoldEvent = async (hold, status) => {
  if (config.useV2Events) {
    await sendV2ResetEvent(hold)
  }
}

const sendV2ResetEvent = async (hold, status) => {
  const event = {
    source: 'ffc-pay-processing',
    type: `uk.gov.defra.ffc.pay.hold.${status}`,
    data: hold
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendHoldEvent
