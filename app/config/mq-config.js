const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object()
  },
  paymentApiSubscription: {
    name: joi.string().default('ffc-sfi-payment-request-api'),
    address: joi.string().default('payment'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  paymentCalculatorSubscription: {
    name: joi.string().default('ffc-sfi-payment-request-calculator'),
    address: joi.string().default('payment'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  withdrawApiSubscription: {
    name: joi.string().default('ffc-sfi-payment-withdraw-api'),
    address: joi.string().default('withdraw'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  withdrawCalculatorSubscription: {
    name: joi.string().default('ffc-sfi-payment-withdraw-calculator'),
    address: joi.string().default('withdraw'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  withdrawViewerSubscription: {
    name: joi.string().default('ffc-sfi-payment-withdraw-viewer'),
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
  paymentApiSubscription: {
    name: process.env.PAYMENT_API_SUBSCRIPTION_NAME,
    address: process.env.PAYMENT_API_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.PAYMENT_API_TOPIC_ADDRESS
  },
  paymentCalculatorSubscription: {
    name: process.env.PAYMENT_CALCULATOR_SUBSCRIPTION_NAME,
    address: process.env.PAYMENT_CALCULATOR_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.PAYMENT_CALCULATOR_TOPIC_ADDRESS
  },
  withdrawApiSubscription: {
    name: process.env.WITHDRAW_API_SUBSCRIPTION_NAME,
    address: process.env.WITHDRAW_API_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.WITHDRAW_API_TOPIC_ADDRESS
  },
  withdrawCalculatorSubscription: {
    name: process.env.WITHDRAW_CALCULATOR_SUBSCRIPTION_NAME,
    address: process.env.WITHDRAW_CALCULATOR_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.WITHDRAW_CALCULATOR_TOPIC_ADDRESS
  },
  withdrawViewerSubscription: {
    name: process.env.WITHDRAW_VIEWER_SUBSCRIPTION_NAME,
    address: process.env.WITHDRAW_VIEWER_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.WITHDRAW_VIEWER_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const paymentApiSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.paymentApiSubscription }
const paymentCalculatorSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.paymentCalculatorSubscription }
const withdrawApiSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.withdrawApiSubscription }
const withdrawCalculatorSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.withdrawCalculatorSubscription }
const withdrawViewerSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.withdrawViewerSubscription }

module.exports = {
  paymentApiSubscription,
  paymentCalculatorSubscription,
  withdrawApiSubscription,
  withdrawCalculatorSubscription,
  withdrawViewerSubscription
}
