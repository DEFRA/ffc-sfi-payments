const createMessage = (paymentRequest) => {
  return {
    body: paymentRequest,
    type: 'uk.gov.pay.processed',
    source: 'ffc-pay-processing'
  }
}

module.exports = createMessage
