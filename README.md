# DERO Merchant NodeJS SDK
Library with bindings for the [DERO Merchant REST API](https://merchant.dero.io/docs) for accepting DERO payments on a NodeJS backend.

## Requirements
- A store registered on your [DERO Merchant Dashboard](https://merchant.dero.io/dashboard) to receive an API Key and a Secret Key, required to send requests to the API.
- A web server running on **NodeJS v8.3.0 or higher**.

## Installation
`npm install dero-merchant-node-sdk`

## Usage
### Import
`const DeroMerchant = require('dero-merchant-node-sdk');`

**Using ES6 modules**

`import DeroMerchant from 'dero-merchant-node-sdk';`

### Setup
```js
const dmClient = new DeroMerchant.Client({
  scheme: 'https', // OPTIONAL. Default: https
  host: 'merchant.dero.io', // OPTIONAL. Default: merchant.dero.io
  apiVersion: 'v1', // OPTIONAL. Default: v1
  apiKey: 'API_KEY_OF_YOUR_STORE_GOES_HERE', // REQUIRED
  secretKey: 'SECRET_KEY_OF_YOUR_STORE_GOES_HERE', // REQUIRED
});

dmClient.ping()
  .catch(err => {
    // Couldn't ping API server.
    // Either scheme/host/apiVersion are invalid or server is offline.
  });
```

### Create a Payment
**Using async/await**
```js
try {
  const payment = await dmClient.createPayment('DERO', 10);
  // OR
  const payment = await dmClient.createPayment('USD', 1); // USD value will be converted to DERO
  // OR
  const payment = await dmClient.createPayment('EUR', 100); // Same goes for EUR and other currencies supported by the CoinGecko API V3

  console.log(payment);
  /*
  The first payment will return something along the lines of:
  {
    paymentID: '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1',
    status: 'pending',
    currency: 'DERO',
    currencyAmount: 10,
    exchangeRate: 1,
    deroAmount: '10.000000000000',
    atomicDeroAmount: 10000000000000,
    integratedAddress: 'dETiaFw6kkrSQ8BByamH8P9iNUCfYsLnUHTL9KftUBRZZEt44i86djtWr9sMpudU955wnLMwcv2YuNGDuTbQwrwDe2tRbFua6e8dW1xcFY6wPTBwHDPNN2eC4gdDNzhJWUL79pD2Tn2ksE',
    creationTime: '2020-01-16T16:49:59.131189Z',
    ttl: 60
  }
  */
} catch(err) {
  console.error(err);
}
```
**Using Promises**
```js
dmClient.createPayment('DERO', 10)
  .then(payment => {
    console.log(payment);
  })
  .catch(err => {
    console.error(err);
  });
```

### Get a Payment from its ID
**Using async/await**
```js
try {
  const paymentID = '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1';
  const payment = await dmClient.getPayment(paymentID);

  console.log(payment);
  /*
  {
    paymentID: '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1',
    status: 'pending',
    currency: 'DERO',
    currencyAmount: 10,
    exchangeRate: 1,
    deroAmount: '10.000000000000',
    atomicDeroAmount: 10000000000000,
    integratedAddress: 'dETiaFw6kkrSQ8BByamH8P9iNUCfYsLnUHTL9KftUBRZZEt44i86djtWr9sMpudU955wnLMwcv2YuNGDuTbQwrwDe2tRbFua6e8dW1xcFY6wPTBwHDPNN2eC4gdDNzhJWUL79pD2Tn2ksE',
    creationTime: '2020-01-16T16:49:59.131189Z',
    ttl: 54
  }
  */
} catch(err) {
  console.error(err);
}
```
**Using Promises**
```js
const paymentID = '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1';
dmClient.getPayment(paymentID)
  .then(payment => {
    console.log(payment);
  })
  .catch(err => {
    console.error(err);
  });
```

### Get an array of Payments from their IDs
**Using async/await**
```js
try {
  const payids = [
    '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1',
    '0edd43c9d6cad603c22962caeaf3554c2cffd46dd246ab222688ad1a8507924a'
  ];
  const payments = await dmClient.getPayments(payids);

  console.log(payments);
  /*
  [{
    paymentID: '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1',
    status: 'pending',
    currency: 'DERO',
    currencyAmount: 10,
    exchangeRate: 1,
    deroAmount: '10.000000000000',
    atomicDeroAmount: 10000000000000,
    integratedAddress: 'dETiaFw6kkrSQ8BByamH8P9iNUCfYsLnUHTL9KftUBRZZEt44i86djtWr9sMpudU955wnLMwcv2YuNGDuTbQwrwDe2tRbFua6e8dW1xcFY6wPTBwHDPNN2eC4gdDNzhJWUL79pD2Tn2ksE',
    creationTime: '2020-01-16T16:49:59.131189Z',
    ttl: 49
  },
  {
    paymentID: '0edd43c9d6cad603c22962caeaf3554c2cffd46dd246ab222688ad1a8507924a',
    status: 'paid',
    currency: 'DERO',
    currencyAmount: 1,
    exchangeRate: 1,
    deroAmount: '1.000000000000',
    atomicDeroAmount: 1000000000000,
    integratedAddress: 'dETiaFw6kkrSQ8BByamH8P9iNUCfYsLnUHTL9KftUBRZZEt44i86djtWr9sMpudU955wnLMwcv2YuNGDuTbQwrwDe2tRWYHz54HavmGWs898KjhhdwAGRdkmFCpaE9gRFzz81HeDJSxT4k',
    creationTime: '2020-01-16T19:24:57.468508Z',
    ttl: 0
  }]
  */
} catch(err) {
    console.error(err);
}
```
**Using Promises**
```js
const payids = [
  '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1',
  '0edd43c9d6cad603c22962caeaf3554c2cffd46dd246ab222688ad1a8507924a'
];

dmClient.getPayments(payids)
  .then(payments => {
    console.log(payments);
  })
  .catch(err => {
    console.error(err);
  });
```

### Get an array of filtered Payments
_Not detailed because this endpoint was created for an internal usecase._

**Using async/await**
```js
try {
  const res = await dmClient.getFilteredPayments({
    limit: int,
    page: int,
    sortBy: string,
    orderBy: string,
    filterStatus: string,
    filterCurrency: string
  });

  console.log(res);
} catch(err) {
  console.error(err);
}
```
**Using Promises**
```js
dmClient.getFilteredPayments(options)
  .then(payments => {
    console.log(payments);
  })
  .catch(err => {
    console.error(err);
  });
```

### Get Pay helper page URL
```js
const paymentID = '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1';
const payURL = dmClient.getPayHelperURL(paymentID);

console.log(payURL); // https://merchant.dero.io/pay/38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1
```

### Verify Webhook Signature
When using Webhooks to receive Payment status updates, it is highly suggested to verify the HTTP requests are actually sent by the DERO Merchant server thorugh the X-Signature header.

**Example using Express**
```js
const webhookSecretKey = 'WEBHOOK_SECRET_KEY_OF_YOUR_STORE_GOES_HERE';

app.post('/dero_merchant_webhook_example', (req, res) => {
  try {
    const jsonBody = req.body; // express.json middleware required
    const stringBody = JSON.stringify(jsonBody); // Function verifyWebhookSignature requires the body as a string, not as a JSON object
    const signatureHeader = req.header('X-Signature');

    const valid = DeroMerchant.verifyWebhookSignature(stringBody, signatureHeader, webhookSecretKey);
    if (valid === true) {
      // Signature was verified. As such, as long Webhook Secret Key was stored securely, request should be trusted.
      // Proceed with updating the status of the order on your store associated to jsonBody.paymentID accordingly to jsonBody.status

      console.log(jsonBody);
      /*
        {
          status: 'paid',
          paymentID: '38ad8cf0c5da388fe9b5b44f6641619659c99df6cdece60c6e202acd78e895b1'
        }
      */
    } else {
      // Signature of the body provided in the request does not match the signature of the body generated using webhookSecretKey.
      // As such, REQUEST SHOULD NOT BE TRUSTED.
      // This could also mean a wrong webhookSecretKey was provided as a param, so be extra careful when copying the value from the Dashboard.
    }
  } catch (err) {
    console.log(error);
  }
});
```
