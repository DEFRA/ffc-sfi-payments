const Joi = require('joi')
const mqConfig = require('./mq-config')
const dbConfig = require('./db-config')
const { development, production, test } = require('./constants').environments

// Define config schema
const schema = Joi.object({
  env: Joi.string().valid(development, test, production).default(development),
  paymentProcessingInterval: Joi.number().default(1000),
  processingCap: Joi.number().default(1000),
  batchGenerationInterval: Joi.number().default(5000),
  batchSize: Joi.number().default(10000),
  batchCap: Joi.number().default(100)
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  paymentProcessingInterval: process.env.PROCESSING_INTERVAL,
  processingCap: process.env.PROCESSING_CAP,
  batchGenerationInterval: process.env.BATCH_INTERVAL,
  batchSize: process.env.BATCH_SIZE,
  batchCap: process.env.BATCH_CAP
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === development
value.isProd = value.env === production

value.paymentSubscription = mqConfig.paymentSubscription
value.withdrawSubscription = mqConfig.withdrawSubscription

value.dbConfig = dbConfig

module.exports = value
