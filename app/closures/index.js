const { getClosureCount } = require('./get-closure-count')
const { getClosures } = require('./get-closures')
const { addClosure } = require('./add-closure')
const { addBulkClosure } = require('./add-bulk-closure')
const { removeClosureById } = require('./remove-closure-by-id')

module.exports = {
  getClosureCount,
  addClosure,
  addBulkClosure,
  getClosures,
  removeClosureById
}
