const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/payment-holds'),
  require('../routes/payment-schemes')
  require('../routes/holds')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
