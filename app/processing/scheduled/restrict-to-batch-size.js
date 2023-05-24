const { processingConfig } = require('../../config')

const restrictToBatchSize = (scheduledPaymentRequests) => {
  return scheduledPaymentRequests.slice(0, processingConfig.processingCap)
}

module.exports = {
  restrictToBatchSize
}
