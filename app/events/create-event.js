const createEvent = (body, type) => {
  return {
    body,
    type,
    source: 'ffc-pay-processing'
  }
}

module.exports = createEvent
