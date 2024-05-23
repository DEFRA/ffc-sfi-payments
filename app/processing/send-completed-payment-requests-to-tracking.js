const { ServiceBusClient } = require('@azure/service-bus')

// Connection string to your Service Bus namespace
const connectionString = '<existing connection string>'

// Name of the queue
const queueName = '<existing queue name>'

// Create a Service Bus client
const sbClient = new ServiceBusClient(connectionString)

const sendCompletedPaymentsToTracking = async (completedPaymentRequests) => {
  const sender = sbClient.createSender(queueName)

  try {
    await sender.sendMessages({ body: JSON.stringify(completedPaymentRequests) })
  } finally {
    await sender.close()
  }
}

module.exports = {
  sendCompletedPaymentsToTracking
}
