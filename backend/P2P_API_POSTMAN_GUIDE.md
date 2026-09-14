# P2P Trading API - Postman Guide

This guide provides instructions for testing the P2P (Peer-to-Peer) trading endpoints using Postman.

## Prerequisites

1. Make sure your Bitby application is running on `http://localhost:8080`
2. You need to be authenticated with a valid JWT token
3. Have at least two user accounts for testing P2P transactions

## Authentication

All P2P endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create P2P Listing

**POST** `http://localhost:8080/api/p2p/create-listing`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

**Body:**
```json
{
    "assetSymbol": "BTC",
    "amount": 0.1,
    "pricePerUnit": 65000,
    "currency": "GHS"
}
```

**Response:**
```json
{
    "id": 1,
    "sellerUsername": "seller123",
    "assetSymbol": "BTC",
    "amount": 0.1,
    "pricePerUnit": 65000.0,
    "currency": "GHS",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
}
```

### 2. Get All Active Listings

**GET** `http://localhost:8080/api/p2p/listings`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
    {
        "id": 1,
        "sellerUsername": "seller123",
        "assetSymbol": "BTC",
        "amount": 0.1,
        "pricePerUnit": 65000.0,
        "currency": "GHS",
        "status": "ACTIVE",
        "createdAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-15T10:30:00"
    },
    {
        "id": 2,
        "sellerUsername": "seller456",
        "assetSymbol": "ETH",
        "amount": 2.5,
        "pricePerUnit": 3500.0,
        "currency": "GHS",
        "status": "ACTIVE",
        "createdAt": "2024-01-15T11:00:00",
        "updatedAt": "2024-01-15T11:00:00"
    }
]
```

### 3. Cancel Listing

**POST** `http://localhost:8080/api/p2p/listings/{listingId}/cancel`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "message": "Listing cancelled successfully"
}
```

### 4. Place Order

**POST** `http://localhost:8080/api/p2p/orders`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

**Body:**
```json
{
    "listingId": 1,
    "amount": 0.05
}
```

**Response:**
```json
{
    "id": 1,
    "listingId": 1,
    "buyerUsername": "buyer123",
    "sellerUsername": "seller123",
    "assetSymbol": "BTC",
    "amount": 0.05,
    "totalPrice": 3250.0,
    "currency": "GHS",
    "status": "PENDING",
    "createdAt": "2024-01-15T12:00:00",
    "updatedAt": "2024-01-15T12:00:00",
    "paymentConfirmedAt": null,
    "assetsReleasedAt": null
}
```

### 5. Confirm Payment (Buyer)

**POST** `http://localhost:8080/api/p2p/orders/{orderId}/confirm-payment`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "message": "Payment confirmed successfully"
}
```

### 6. Release Assets (Seller)

**POST** `http://localhost:8080/api/p2p/orders/{orderId}/release`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "message": "Assets released successfully"
}
```

### 7. Cancel Order

**POST** `http://localhost:8080/api/p2p/orders/{orderId}/cancel`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "message": "Order cancelled successfully"
}
```

### 8. Get Buyer Orders

**GET** `http://localhost:8080/api/p2p/orders/buyer`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
    {
        "id": 1,
        "listingId": 1,
        "buyerUsername": "buyer123",
        "sellerUsername": "seller123",
        "assetSymbol": "BTC",
        "amount": 0.05,
        "totalPrice": 3250.0,
        "currency": "GHS",
        "status": "COMPLETED",
        "createdAt": "2024-01-15T12:00:00",
        "updatedAt": "2024-01-15T12:30:00",
        "paymentConfirmedAt": "2024-01-15T12:15:00",
        "assetsReleasedAt": "2024-01-15T12:30:00"
    }
]
```

### 9. Get Seller Orders

**GET** `http://localhost:8080/api/p2p/orders/seller`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
    {
        "id": 1,
        "listingId": 1,
        "buyerUsername": "buyer123",
        "sellerUsername": "seller123",
        "assetSymbol": "BTC",
        "amount": 0.05,
        "totalPrice": 3250.0,
        "currency": "GHS",
        "status": "COMPLETED",
        "createdAt": "2024-01-15T12:00:00",
        "updatedAt": "2024-01-15T12:30:00",
        "paymentConfirmedAt": "2024-01-15T12:15:00",
        "assetsReleasedAt": "2024-01-15T12:30:00"
    }
]
```

## Testing Scenarios

### Scenario 1: Complete P2P Transaction

1. **Seller creates a listing:**
   - Use seller account to create a BTC listing
   - Verify the listing appears in active listings

2. **Buyer places an order:**
   - Use buyer account to place an order
   - Verify buyer's currency balance is deducted
   - Verify seller's asset balance is deducted

3. **Buyer confirms payment:**
   - Use buyer account to confirm payment
   - Verify order status changes to PAYMENT_CONFIRMED

4. **Seller releases assets:**
   - Use seller account to release assets
   - Verify buyer receives the assets
   - Verify seller receives the currency
   - Verify order status changes to COMPLETED

### Scenario 2: Order Cancellation

1. **Place an order** (steps 1-2 from Scenario 1)

2. **Cancel the order:**
   - Use either buyer or seller account to cancel
   - Verify balances are refunded
   - Verify listing amount is restored

### Scenario 3: Listing Cancellation

1. **Create a listing** (step 1 from Scenario 1)

2. **Cancel the listing:**
   - Use seller account to cancel listing
   - Verify listing status changes to CANCELLED

## Error Handling

The API returns appropriate error messages for various scenarios:

- **Insufficient balance:** "Insufficient BTC balance"
- **Unauthorized actions:** "You can only cancel your own listings"
- **Invalid status:** "Order is not in pending status"
- **Self-trading:** "You cannot buy from yourself"

## Order Status Flow

1. **PENDING** - Order created, waiting for payment confirmation
2. **PAYMENT_CONFIRMED** - Buyer confirmed payment
3. **ASSETS_RELEASED** - Seller released assets
4. **COMPLETED** - Transaction completed
5. **CANCELLED** - Order cancelled

## Listing Status

- **ACTIVE** - Listing is available for trading
- **CANCELLED** - Listing has been cancelled
- **COMPLETED** - All assets in listing have been sold

## Supported Assets

- BTC (Bitcoin)
- ETH (Ethereum)
- USDT (Tether)
- USD (US Dollar)
- BNB (Binance Coin)

## Supported Currencies

- GHS (Ghanaian Cedi)
- USD (US Dollar) 