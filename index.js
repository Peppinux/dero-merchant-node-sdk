module.exports = {
  Client: require('./lib/client'),
  verifyWebhookSignature: require('./lib/webhook').verifyWebhookSignature,
}
