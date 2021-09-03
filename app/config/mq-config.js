const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string(),
    username: joi.string(),
    password: joi.string(),
    useCredentialChain: joi.bool().default(false),
    type: joi.string().default('subscription'),
    appInsights: joi.object()
  },
  processingSubscription: {
    name: joi.string(),
    address: joi.string(),
    topic: joi.string(),
    numberOfReceivers: joi.number().default(3)
  },
  acknowledgementSubscription: {
    name: joi.string(),
    address: joi.string(),
    topic: joi.string()
  },
  returnSubscription: {
    name: joi.string(),
    address: joi.string(),
    topic: joi.string()
  },
  submitTopic: {
    name: joi.string(),
    address: joi.string()
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'subscription',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  processingSubscription: {
    name: process.env.PROCESSING_SUBSCRIPTION_NAME,
    address: process.env.PROCESSING_SUBSCRIPTION_ADDRESS,
    topic: process.env.PROCESSING_TOPIC_ADDRESS
  },
  acknowledgementSubscription: {
    name: process.env.ACKNOWLEDGEMENT_SUBSCRIPTION_NAME,
    address: process.env.ACKNOWLEDGEMENT_SUBSCRIPTION_ADDRESS,
    topic: process.env.ACKNOWLEDGEMENT_TOPIC_ADDRESS
  },
  returnSubscription: {
    name: process.env.RETURN_SUBSCRIPTION_NAME,
    address: process.env.RETURN_SUBSCRIPTION_ADDRESS,
    topic: process.env.RETURN_TOPIC_ADDRESS
  },
  submitTopic: {
    name: process.env.PAYMENTSUBMIT_TOPIC_NAME,
    address: process.env.PAYMENTSUBMIT_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const processingSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.processingSubscription }
const acknowledgementSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.acknowledgementSubscription }
const returnSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.returnSubscription }
const submitTopic = { ...mqResult.value.messageQueue, ...mqResult.value.submitTopic }

module.exports = {
  processingSubscription,
  acknowledgementSubscription,
  returnSubscription,
  submitTopic
}
