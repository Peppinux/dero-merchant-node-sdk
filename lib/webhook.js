const validMAC = require('./cryptoutil').validMAC

/**
 * Verify the signature of a webhook request
 *
 * @param {string} reqBody - The JSON.stringified body of the request
 * @param {string} reqSignature - The signature of the request found in the X-Signature header
 * @param {string} webhookSecretKey - The webhook secret key of the store
 * @return {boolean} Request validity
 */
const verifyWebhookSignature = (reqBody, reqSignature, webhookSecretKey) => {
  return validMAC(reqBody, reqSignature, webhookSecretKey)
}

module.exports = {
  verifyWebhookSignature,
}
