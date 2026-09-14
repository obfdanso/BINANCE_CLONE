# Bitby Assets API – Postman Testing Guide

## Prerequisites

- **Backend running** (Spring Boot app)
- **Database seeded** with at least one user
- **Paystack test keys** set in `application.properties`
- **Postman** installed
- **Authentication enabled** (JWT-based)

---

## 1. Authentication

> **All endpoints require authentication.**
> Obtain a JWT token using your login endpoint and add:
>
> `Authorization: Bearer <your_token>`
>
> to all requests.

---

## 2. Get Asset Overview

**Endpoint:**  
`GET /api/assets/overview?selectedCurrency=<CURRENCY>`

- `selectedCurrency` is optional, defaults to `USD` if not provided.
- The userId is automatically taken from your JWT (no need to pass it).
- The response always includes your GHS (Ghanaian Cedi) balance and its value in USD.
- If you pass `selectedCurrency=BTC`, `USDT`, `BNB`, or `ETH`, the response will also include the value of your GHS balance in that currency.
- The `estimatedTotalValue` field is always in the selected currency.

**Request Example:**
```
GET http://localhost:8080/api/assets/overview?selectedCurrency=BTC
Headers:
  Content-Type: application/json
  Authorization: Bearer <your_token>
```

**Response Example (BTC toggle):**
```json
{
  "balances": {
    "GHS": 100,
    "USD": 8.5,
    "BTC": 0.00013
  },
  "selectedCurrency": "BTC",
  "estimatedTotalValue": 0.00013,
  "lastPrices": {
    "GHS": 1,
    "USD": 0.085,
    "BTC": 65000
  }
}
```

**Response Example (default, USD):**
```json
{
  "balances": {
    "GHS": 100,
    "USD": 8.5
  },
  "selectedCurrency": "USD",
  "estimatedTotalValue": 8.5,
  "lastPrices": {
    "GHS": 1,
    "USD": 0.085
  }
}
```

---

## 3. Get Asset Price History

**Endpoint:**  
`GET /api/assets/price-history`

**Request Example:**
```
GET http://localhost:8080/api/assets/price-history
Headers:
  Content-Type: application/json
  Authorization: Bearer <your_token>
```

---

## 4. Deposit Funds (GHS Only)

**Endpoint:**  
`POST /api/assets/deposit?currency=GHS`

- Only `GHS` is allowed for deposits.
- The deposit will be credited to your GHS balance after Paystack confirms payment.

**Request Body Example:**
```json
{
  "phoneNumber": "233XXXXXXXXX",
  "amount": 100
}
```

**Request Example:**
```
POST http://localhost:8080/api/assets/deposit?currency=GHS
Headers:
  Content-Type: application/json
  Authorization: Bearer <your_token>
Body:
  {
    "phoneNumber": "233XXXXXXXXX",
    "amount": 100
  }
```

**Response Example:**
```json
{
  "status": "PENDING",
  "transactionId": "psk_test_xxx",
  "message": "https://checkout.paystack.com/psk_test_xxx"
}
```

**Next Steps:**
- Open the `authorization_url` in your browser to complete the payment.
- On success, Paystack will call your webhook and update your GHS balance.

---

## 5. Simulate Paystack Webhook (For Local Testing)

**Endpoint:**  
`POST /api/assets/paystack/webhook`

- In production, Paystack will call this endpoint automatically after a successful payment.
- For local testing, use Postman to send a sample webhook payload.

**Request Example:**
```
POST http://localhost:8080/api/assets/paystack/webhook
Headers:
  Content-Type: application/json
  x-paystack-signature: <any-string-for-test>
Body:
  (Paste a sample Paystack webhook JSON for `charge.success`)
```

**Sample Payload:**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "psk_test_xxx",
    "amount": 10000,
    "currency": "GHS",
    "customer": {
      "email": "233XXXXXXXXX@bitby.com"
    }
  }
}
```

---

## 6. Buy Asset

**Endpoint:**  
`POST /api/assets/buy`

- The userId is automatically taken from your JWT (no need to pass it).
- You can buy BTC, ETH, or USDT using your balance in any supported currency.

**Request Body Example:**
```json
{
  "assetSymbol": "BTC",
  "amount": 0.001,
  "currency": "USD"
}
```

**Request Example:**
```
POST http://localhost:8080/api/assets/buy
Headers:
  Content-Type: application/json
  Authorization: Bearer <your_token>
Body:
  {
    "assetSymbol": "BTC",
    "amount": 0.001,
    "currency": "USD"
  }
```

**Response Example:**
```json
{
  "status": "SUCCESS",
  "transactionId": "uuid-xxxx",
  "message": "Asset purchased successfully"
}
```

---

## 7. Check Updated Balances

After a successful deposit or buy, repeat **Step 2** to verify your updated balances.

---

## 8. Withdraw (If Implemented)

> If you have a withdraw endpoint, test it similarly to deposit.

---

## Notes

- Replace `localhost:8080` with your server’s address if different.
- Always use your actual JWT in the `Authorization` header.
- For Paystack webhook, in production, Paystack will POST to your public endpoint. For local testing, use Postman or a tool like [ngrok](https://ngrok.com/) to expose your local server.

---

**Happy Testing!**  
Let me know if you need a ready-to-import Postman collection or further help. 

## Testing Withdrawals (GHS) with Paystack (Test Mode)

### Endpoint
`POST /api/assets/withdraw`

### Headers
- `Authorization: Bearer <your_jwt_token>`
- `Content-Type: application/json`

### Sample Request Body
```
{
  "amount": 50.0,
  "currency": "GHS",
  "phoneNumber": "0241234567"
}
```

### How it works
- Only GHS withdrawals are supported.
- The system checks if your GHS balance is sufficient.
- If sufficient, the amount is deducted and a simulated Paystack transfer is initiated (test mode).
- You will receive a response with status, transactionId, and a message.

### Sample Response
```
{
  "status": "PENDING",
  "transactionId": "TRF_xxxxxxxx",
  "message": "Withdrawal initiated"
}
```

### Notes
- In test mode, no real money is moved. All actions are simulated by Paystack.
- You can use any valid Ghanaian phone number for testing.
- If you try to withdraw more than your GHS balance, you will receive an error response.
- For production, you must implement recipient creation and use the returned recipient_code for transfers. 