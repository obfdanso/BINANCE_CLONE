# Convert API - Postman Testing Guide

This guide provides Postman collection examples for testing the Convert feature API endpoints.

## Base URL
```
http://localhost:8080
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 1. Get Conversion Quote

### Request
```http
POST {{baseUrl}}/api/v1/convert/quote
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1"
}
```

### Response
```json
{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "fromAmount": "0.1",
    "toAmount": "1.23456789",
    "exchangeRate": "12.34567890",
    "fee": "0.00123457",
    "feePercentage": "0.001",
    "quoteTime": "2024-01-15T10:30:00",
    "expiresAt": "2024-01-15T10:31:00",
    "message": "Quote generated successfully",
    "success": true
}
```

## 2. Instant Convert

### Request
```http
POST {{baseUrl}}/api/v1/convert/instant
Authorization: Bearer {{jwtToken}}
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1",
    "convertType": "INSTANT"
}
```

### Response
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
    "targetPrice": null,
    "recurringInterval": null,
    "nextExecutionTime": null,
    "lastExecutionTime": null,
    "totalExecutions": null,
    "maxExecutions": null,
    "createdAt": "2024-01-15T10:30:00",
    "executedAt": "2024-01-15T10:30:00",
    "expiresAt": null,
    "message": "Instant conversion executed successfully",
    "success": true
}
```

## 3. Limit Convert

### Request
```http
POST {{baseUrl}}/api/v1/convert/limit
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

### Response
```json
{
    "orderId": 2,
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "fromAmount": "0.1",
    "toAmount": null,
    "exchangeRate": null,
    "convertType": "LIMIT",
    "status": "PENDING",
    "targetPrice": "12.5",
    "recurringInterval": null,
    "nextExecutionTime": null,
    "lastExecutionTime": null,
    "totalExecutions": null,
    "maxExecutions": null,
    "createdAt": "2024-01-15T10:30:00",
    "executedAt": null,
    "expiresAt": "2024-01-20T10:30:00",
    "message": "Limit conversion order created successfully",
    "success": true
}
```

## 4. Recurring Convert

### Request
```http
POST {{baseUrl}}/api/v1/convert/recurring
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

### Response
```json
{
    "orderId": 3,
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "fromAmount": "0.01",
    "toAmount": null,
    "exchangeRate": null,
    "convertType": "RECURRING",
    "status": "PENDING",
    "targetPrice": null,
    "recurringInterval": "WEEKLY",
    "nextExecutionTime": "2024-01-22T10:30:00",
    "lastExecutionTime": null,
    "totalExecutions": 0,
    "maxExecutions": 12,
    "createdAt": "2024-01-15T10:30:00",
    "executedAt": null,
    "expiresAt": "2024-12-31T23:59:59",
    "message": "Recurring conversion order created successfully",
    "success": true
}
```

## 5. Get User Orders

### Request
```http
GET {{baseUrl}}/api/v1/convert/orders
Authorization: Bearer {{jwtToken}}
```

### Response
```json
[
    {
        "orderId": 1,
        "fromSymbol": "BTC",
        "toSymbol": "ETH",
        "fromAmount": "0.1",
        "toAmount": "1.23456789",
        "exchangeRate": "12.34567890",
        "convertType": "INSTANT",
        "status": "EXECUTED",
        "targetPrice": null,
        "recurringInterval": null,
        "nextExecutionTime": null,
        "lastExecutionTime": null,
        "totalExecutions": null,
        "maxExecutions": null,
        "createdAt": "2024-01-15T10:30:00",
        "executedAt": "2024-01-15T10:30:00",
        "expiresAt": null,
        "message": null,
        "success": true
    },
    {
        "orderId": 2,
        "fromSymbol": "BTC",
        "toSymbol": "ETH",
        "fromAmount": "0.1",
        "toAmount": null,
        "exchangeRate": null,
        "convertType": "LIMIT",
        "status": "PENDING",
        "targetPrice": "12.5",
        "recurringInterval": null,
        "nextExecutionTime": null,
        "lastExecutionTime": null,
        "totalExecutions": null,
        "maxExecutions": null,
        "createdAt": "2024-01-15T10:30:00",
        "executedAt": null,
        "expiresAt": "2024-01-20T10:30:00",
        "message": null,
        "success": true
    }
]
```

## 6. Cancel Order

### Request
```http
DELETE {{baseUrl}}/api/v1/convert/orders/2
Authorization: Bearer {{jwtToken}}
```

### Response
```json
{
    "orderId": 2,
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "fromAmount": "0.1",
    "toAmount": null,
    "exchangeRate": null,
    "convertType": "LIMIT",
    "status": "CANCELLED",
    "targetPrice": "12.5",
    "recurringInterval": null,
    "nextExecutionTime": null,
    "lastExecutionTime": null,
    "totalExecutions": null,
    "maxExecutions": null,
    "createdAt": "2024-01-15T10:30:00",
    "executedAt": null,
    "expiresAt": "2024-01-20T10:30:00",
    "message": "Order cancelled successfully",
    "success": true
}
```

## 7. Get Convert Types

### Request
```http
GET {{baseUrl}}/api/v1/convert/types
```

### Response
```json
{
    "types": ["INSTANT", "LIMIT", "RECURRING"],
    "recurringIntervals": ["DAILY", "WEEKLY", "MONTHLY"]
}
```

## Postman Collection Variables

### Environment Variables
```json
{
    "baseUrl": "http://localhost:8080",
    "jwtToken": "YOUR_JWT_TOKEN_HERE"
}
```

### Global Variables
```json
{
    "userId": "USER_ID_HERE"
}
```

## Test Scenarios

### Scenario 1: Complete Convert Flow
1. Get quote for BTC to ETH conversion
2. Create instant convert order
3. Verify order execution
4. Check user orders list

### Scenario 2: Limit Order Flow
1. Get quote for BTC to ETH conversion
2. Create limit convert order with target price
3. Wait for market conditions to be met
4. Verify order execution
5. Check order status

### Scenario 3: Recurring Order Flow
1. Create recurring convert order (weekly)
2. Wait for scheduled execution time
3. Verify order execution
4. Check next execution time
5. Monitor total executions

### Scenario 4: Order Management
1. Create multiple orders (instant, limit, recurring)
2. Get user orders list
3. Cancel a pending order
4. Verify order cancellation

## Error Testing

### Invalid Request
```http
POST {{baseUrl}}/api/v1/convert/instant
Authorization: Bearer {{jwtToken}}
Content-Type: application/json

{
    "fromSymbol": "INVALID",
    "toSymbol": "ETH",
    "amount": "0.1",
    "convertType": "INSTANT"
}
```

### Response
```json
{
    "success": false,
    "message": "One or both cryptocurrencies not found"
}
```

### Unauthorized Request
```http
POST {{baseUrl}}/api/v1/convert/instant
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1",
    "convertType": "INSTANT"
}
```

### Response
```json
{
    "timestamp": "2024-01-15T10:30:00.000+00:00",
    "status": 401,
    "error": "Unauthorized",
    "path": "/api/v1/convert/instant"
}
```

## WebSocket Testing

### Connect to WebSocket
```javascript
// In Postman WebSocket request
ws://localhost:8080/ws

// Subscribe to topics
SUBSCRIBE /topic/convert/{{userId}}
SUBSCRIBE /topic/market-data
```

### Expected Messages
```json
{
    "orderId": 1,
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "status": "EXECUTED",
    "executedAt": "2024-01-15T10:30:00"
}
```

## Performance Testing

### Load Testing
- Create multiple orders simultaneously
- Test quote generation under load
- Monitor WebSocket message delivery
- Check database performance

### Stress Testing
- Create orders with invalid data
- Test with expired JWT tokens
- Monitor error handling
- Check system recovery

## Security Testing

### Authentication
- Test without JWT token
- Test with expired token
- Test with invalid token format
- Test token tampering

### Authorization
- Try to access another user's orders
- Try to cancel another user's order
- Test order ownership validation

### Input Validation
- Test with negative amounts
- Test with invalid cryptocurrency symbols
- Test with malformed JSON
- Test SQL injection attempts

## Monitoring

### Logs to Monitor
- Convert order creation logs
- Order execution logs
- WebSocket connection logs
- Error logs
- Performance metrics

### Metrics to Track
- Order success rate
- Average execution time
- WebSocket message delivery rate
- API response times
- Error rates by endpoint

This Postman guide provides comprehensive testing scenarios for the Convert feature API endpoints. 