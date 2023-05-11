const { PROCESSED } = require('../constants/messages')
const { SOURCE } = require('../constants/source')

const createMessage = (body) => {
  return {
    body,
    type: PROCESSED,
    source: SOURCE
  }
}

module.exports = {
  createMessage
}
