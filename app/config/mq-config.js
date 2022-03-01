const Joi = require('joi')

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string().required(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  processingSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription'),
    numberOfReceivers: Joi.number().default(3)
  },
  acknowledgementSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  returnSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  submitTopic: {
    address: Joi.string().required()
  },
  debtTopic: {
    address: Joi.string().required()
  },
  qcSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  manualTopic: {
    address: Joi.string().required()
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  processingSubscription: {
    address: process.env.PROCESSING_SUBSCRIPTION_ADDRESS,
    topic: process.env.PROCESSING_TOPIC_ADDRESS
  },
  acknowledgementSubscription: {
    address: process.env.ACKNOWLEDGEMENT_SUBSCRIPTION_ADDRESS,
    topic: process.env.ACKNOWLEDGEMENT_TOPIC_ADDRESS
  },
  returnSubscription: {
    address: process.env.RETURN_SUBSCRIPTION_ADDRESS,
    topic: process.env.RETURN_TOPIC_ADDRESS
  },
  submitTopic: {
    address: process.env.PAYMENTSUBMIT_TOPIC_ADDRESS
  },
  debtTopic: {
    address: process.env.DEBT_TOPIC_ADDRESS
  },
  qcSubscription: {
    address: process.env.QC_SUBSCRIPTION_ADDRESS,
    topic: process.env.QC_TOPIC_ADDRESS
  },
  manualTopic: {
    address: process.env.MANUALCHECK_TOPIC_ADDRESS
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
const debtTopic = { ...mqResult.value.messageQueue, ...mqResult.value.debtTopic }
const qcSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.qcSubscription }
const manualTopic = { ...mqResult.value.messageQueue, ...mqResult.value.manualTopic }

module.exports = {
  processingSubscription,
  acknowledgementSubscription,
  returnSubscription,
  submitTopic,
  debtTopic,
  qcSubscription,
  manualTopic
}
