const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/payment-holds')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
