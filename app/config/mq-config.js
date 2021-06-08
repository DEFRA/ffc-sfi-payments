const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object()
  },
  paymentSubscription: {
    name: joi.string().default('ffc-sfi-payment-request'),
    address: joi.string().default('payment'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  withdrawSubscription: {
    name: joi.string().default('ffc-sfi-agreement-withdraw'),
    address: joi.string().default('withdraw'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'subscription',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  paymentSubscription: {
    name: process.env.PAYMENT_SUBSCRIPTION_NAME,
    address: process.env.PAYMENT_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.PAYMENT_TOPIC_ADDRESS
  },
  withdrawSubscription: {
    name: process.env.WITHDRAW_SUBSCRIPTION_NAME,
    address: process.env.WITHDRAW_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.WITHDRAW_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const paymentSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.paymentSubscription }
const withdrawSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.withdrawSubscription }

module.exports = {
  paymentSubscription,
  withdrawSubscription
}
