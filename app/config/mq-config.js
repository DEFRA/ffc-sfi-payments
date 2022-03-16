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
  debtResponseSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  qcSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
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
  debtResponseSubscription: {
    address: process.env.DEBTRESPONSE_SUBSCRIPTION_ADDRESS,
    topic: process.env.DEBTRESPONSE_TOPIC_ADDRESS
  },
  qcSubscription: {
    address: process.env.QC_SUBSCRIPTION_ADDRESS,
    topic: process.env.QC_TOPIC_ADDRESS
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
const debtResponseSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.debtResponseSubscription }
const qcSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.qcSubscription }

module.exports = {
  processingSubscription,
  acknowledgementSubscription,
  returnSubscription,
  submitTopic,
  debtTopic,
  debtResponseSubscription,
  qcSubscription
}
