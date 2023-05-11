const reallocateToLedger = (paymentRequest, unsettledLedger) => {
  paymentRequest.ledger = unsettledLedger
  return [paymentRequest]
}

module.exports = {
  reallocateToLedger
}
