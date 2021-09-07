const createEvent = (body, type) => {
  return {
    body,
    type,
    source: 'ffc-sfi-payments'
  }
}

module.exports = createEvent
