const axios = require('axios')
const signMessage = require('./cryptoutil').signMessage

/**
 * @classdesc Dero Merchant Client. Has methods to interact with the Dero Merchant REST API.
 * @class
 */
class Client {
  /**
   * Create a Client
   * 
   * @constructor
   * @param {{scheme: string, host: string, apiVersion: string, apiKey: string, secretKey: string}} Options
   */
  constructor({ scheme = 'https', host = 'merchant.dero.io', apiVersion = 'v1', apiKey = '', secretKey = '' }) {
    this.scheme = scheme
    this.host = host
    this.apiVersion = apiVersion

    this.apiKey = apiKey
    this.secretKey = secretKey

    this.baseURL = `${this.scheme}://${this.host}/api/${this.apiVersion}`
    this.axiosClient = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'User-Agent': 'DeroMerchant_Client_NodeJS/1.0',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': this.apiKey,
      },
    })
  }

  /**
   * Send a request to the API
   * 
   * @param {{method: string, endpoint: string, queryParams: Object, body: Object, signBody: boolean}} Options
   * @return {Object} Response body
   */
  async sendRequest({ method, endpoint, queryParams, body, signBody = false }) {
    try {
      let req = {
        method: method,
        url: `${this.baseURL}${endpoint}`,
      }

      if (queryParams !== undefined && typeof queryParams === 'object') {
        req.params = queryParams
      }

      if (body !== undefined) {
        req.data = JSON.stringify(body)

        if (signBody === true) {
          const signature = signMessage(req.data, this.secretKey)
          req.headers = {
            'X-Signature': signature,
          }
        }
      }

      const res = await this.axiosClient(req)
      return res.data
    } catch (err) {
      if (err.response !== undefined && err.response.data !== undefined && err.response.data.error !== undefined) {
        return Promise.reject(err.response.data.error)
      } else {
        if (err.response !== undefined && err.response.status !== undefined && err.config !== undefined && err.config.url !== undefined) {
          if (err.response.status === 404) {
            return Promise.reject(`DeroMerchant Client: error 404: page ${err.config.url} not found`)
          } else {
            return Promise.reject(`DeroMerchant Client: error ${err.response.status} returned by ${err.config.url}`)
          }
        } else {
          return Promise.reject(`DeroMerchant Client: ${err.toString()}`)
        }
      }
    }
  }

  /**
   * Ping the API
   * 
   * @return {Object} Ping response body
   */
  async ping() {
    return await this.sendRequest({
      method: 'GET',
      endpoint: `/ping`,
    })
  }

  /**
   * Create a new payment
   * 
   * @param {string} currency
   * @param {number} amount
   * @return {Object} Payment
   */
  async createPayment(currency, amount) {
    return await this.sendRequest({
      method: 'POST',
      endpoint: '/payment',
      body: {
        currency,
        amount,
      },
      signBody: true,
    })
  }

  /**
   * Get a payment from its ID
   * 
   * @param {string} paymentID
   * @return {Object} Payment
   */
  async getPayment(paymentID) {
    return await this.sendRequest({
      method: 'GET',
      endpoint: `/payment/${paymentID}`,
    })
  }

  /**
   * Get an array of payments from their IDs
   * 
   * @param {Array<string>} paymentIDs
   * @return {Array<Object>} Payments
   */
  async getPayments(paymentIDs) {
    return await this.sendRequest({
      method: 'POST',
      endpoint: `/payments`,
      body: paymentIDs,
    })
  }

  /**
   * Get filtered payments
   * 
   * @param {{limit: number, page: number, sortBy: string, orderBy: string, filterStatus: string, filterCurrency: string}} Options
   * @return {Object} Response
   */
  async getFilteredPayments({ limit, page, sortBy, orderBy, filterStatus, filterCurrency } = {}) {
    return await this.sendRequest({
      method: 'GET',
      endpoint: `/payments`,
      queryParams: {
        limit: limit,
        page: page,
        sort_by: sortBy,
        order_by: orderBy,
        status: filterStatus,
        currency: filterCurrency,
      }
    })
  }

  /**
   * Get Pay helper URL of a PaymentID
   * 
   * @param {string} paymentID
   * @return {string} Pay helper URL
   */
  getPayHelperURL(paymentID) {
    return `${this.scheme}://${this.host}/pay/${paymentID}`
  }
}

module.exports = Client
