# Convert Feature - Postman Testing Guide

Quick guide to test the Convert feature endpoints in Postman.

## Setup

### Base URL
```
http://localhost:8080
```

### Authentication
Get JWT token from login endpoint and add to headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### 1. Get Quote (No Auth Required)
```http
POST /api/v1/convert/quote
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1"
}
```

### 2. Instant Convert
```http
POST /api/v1/convert/instant
Authorization: Bearer {{jwtToken}}
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1",
    "convertType": "INSTANT"
}
```

### 3. Limit Convert
```http
POST /api/v1/convert/limit
Authorization: Bearer {{jwtToken}}
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1",
    "convertType": "LIMIT",
    "targetPrice": "12.5",
    "expiresAt": "2024-01-20T10:30:00"
}
```

### 4. Recurring Convert
```http
POST /api/v1/convert/recurring
Authorization: Bearer {{jwtToken}}
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.01",
    "convertType": "RECURRING",
    "recurringInterval": "WEEKLY",
    "startTime": "2024-01-15T10:30:00",
    "maxExecutions": 12,
    "expiresAt": "2024-12-31T23:59:59"
}
```

### 5. Get User Orders
```http
GET /api/v1/convert/orders
Authorization: Bearer {{jwtToken}}
```

### 6. Cancel Order
```http
DELETE /api/v1/convert/orders/{orderId}
Authorization: Bearer {{jwtToken}}
```

### 7. Get Convert Types
```http
GET /api/v1/convert/types
```

## Postman Environment Variables

Create environment with these variables:
```json
{
    "baseUrl": "http://localhost:8080",
    "jwtToken": "YOUR_JWT_TOKEN_HERE"
}
```

## Quick Test Flow

1. **Get Quote** - Test without authentication
2. **Login** - Get JWT token from your auth endpoint
3. **Instant Convert** - Test immediate conversion
4. **Get Orders** - Verify order was created
5. **Limit Convert** - Create pending order
6. **Cancel Order** - Test order cancellation

## Expected Responses

### Success Response
```json
{
    "orderId": 1,
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "fromAmount": "0.1",
    "toAmount": "1.23456789",
    "exchangeRate": "12.34567890",
    "convertType": "INSTANT",
    "status": "EXECUTED",
    "message": "Instant conversion executed successfully",
    "success": true
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description"
}
```

## Common Issues

- **401 Unauthorized**: Check JWT token
- **400 Bad Request**: Validate request body
- **404 Not Found**: Check cryptocurrency symbols
- **500 Server Error**: Check application logs

## WebSocket Testing

Connect to WebSocket for real-time updates:
```
ws://localhost:8080/ws
```

Subscribe to topics:
- `/topic/convert/{userId}` - User-specific updates
- `/topic/market-data` - Market data updates 