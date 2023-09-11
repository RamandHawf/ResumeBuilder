
// const NiceHash = require('nicehash-api');
// let NiceHash = new NiceHash({
//     apiHost: 'https://api-test.nicehash.com',
// apiKey: "4eb34696-9580-43e5-ba31-d5f39c4aa1b9",
// apiSecret:"f85ad697-830e-4f79-9378-78940e88c6d449e5007e-399f-4542-a88d-3b644f568522",
// orgId:"860becbe-ab5b-4bd2-b8e4-dd1b53184642"
// })
// NiceHash.testAuthorization().then(success => success).catch(err => err)
const request = require('request')
const throttledRequest = require('throttled-request')
const chance = require('chance').Chance()
const crypto = require('crypto')
const qs = require('querystring')
class Nicehash {
  constructor (apikey, apiSecret, organizationId) {
    this.apikey = apikey
    this.apiSecret = apiSecret
    this.organizationId = organizationId
    this.httpClient = throttledRequest(request.defaults({
      baseUrl: `https://api-test.nicehash.com`,
      forever: true,
      timeout: 3000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        'X-Organization-Id': this.organizationId
      },
      json: true
    }))
    this.httpClient.configure({
      requests: 1,
      milliseconds: 1500 * 2
    })
  }
  request (method, path, query, body, cb) {
    let headers = {
      'X-Request-Id': +Date.now(),
      'X-Time': +Date.now(),
      'X-Nonce': chance.guid()
    }
    query = qs.stringify(query)
    let input = [
      this.apikey,
      headers['X-Time'].toString(),
      headers['X-Nonce'],
      null,
      this.organizationId,
      null,
      method.toUpperCase(),
      path,
      query
    ]
    if (body) {
      input.push(JSON.stringify(body))
    }
    headers['X-Auth'] = `${this.apikey}:${this.hmacSha256BySegments(input)}`
    this.httpClient({
      url: `${path}${query ? '?' : ''}${query}`,
      body,
      method,
      headers
    }, cb)
  }
  hmacSha256BySegments (input) {
    let signature = crypto.createHmac('sha256', this.apiSecret)
    for (let index in input) {
      if (+index) {
        signature.update(Buffer.from([0]))
      }
      if (input[index] !== null) {
        signature.update(Buffer.from(input[index]))
      }
    }
    return signature.digest('hex')
  }
  hasAuthTokens() {
    return !!this.apiKey && !!this.apiSecret;;
}
  getAuthParams() {
    return { key: this.apikey, seccret: this.apiSecret };
   }
  orderBook (query, cb) {
    this.request('GET', '/main/api/v2/hashpower/orderBook/', query, undefined, cb)
  }
  myOrderBook (query, cb) {
    this.request('GET', '/main/api/v2/hashpower/myOrders', query, undefined, cb)
  }
  createOrder (body, cb) {
    this.request('POST', '/main/api/v2/hashpower/order', {}, body, cb)
  }
  getOrder (orderId, cb) {
    this.request('GET', `/main/api/v2/hashpower/order/${orderId}`, {}, undefined, cb)
  }
  getpoolwithid (poolId, cb) {
    this.request('GET', `/main/api/v2/pool/${poolId}`, {}, undefined, cb)
  }
  deleteOrder (orderId, cb) {
    this.request('DELETE', `/main/api/v2/hashpower/order/${orderId}`, {}, undefined, cb)
  }
  refillOrder (orderId, body, cb) {
    this.request('POST', `/main/api/v2/hashpower/order/${orderId}/refill`, body, undefined, cb)
  }
  updateOrderPriceAndLimit (orderId, body, cb) {
    this.request('POST', `/main/api/v2/hashpower/order/${orderId}/updatePriceAndLimit`, {}, body, cb)
  }
  getPools (size, page,algorithm, cb) {
    this.request('GET', `/main/api/v2/pools?size=${size}&page=${page}&algorithm=${algorithm}`, cb)
  }
  createPool (body, cb) {
    this.request('POST', '/main/api/v2/pool', {}, body, cb)
  }
  getStats (orderId, cb) {
    this.request('GET', `/main/api/v2/hashpower/order/${orderId}/stats`, {}, undefined, cb)
  }
}
module.exports = Nicehash