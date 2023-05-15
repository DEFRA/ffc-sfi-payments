const { SOURCE } = require('../constants/source')

const createMessage = (body, type) => {
  return {
    body,
    type,
    source: SOURCE
  }
}

module.exports = {
  createMessage
}
