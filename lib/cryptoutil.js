const crypto = require('crypto')

/**
 * @param {string} message 
 * @param {string} key
 * @return {string} hash
 */
const signMessage = (message, key) => {
  return crypto
    .createHmac('sha256', Buffer.from(key, 'hex'))
    .update(message)
    .digest('hex')
}

/**
 * @param {string} message 
 * @param {string} messageMAC 
 * @param {string} key
 * @return {boolean} valid 
 */
const validMAC = (message, messageMAC, key) => {
  const signedMessage = signMessage(message, key)
  return crypto.timingSafeEqual(Buffer.from(messageMAC, 'hex'), Buffer.from(signedMessage, 'hex'))
}

module.exports = {
  signMessage,
  validMAC,
}
