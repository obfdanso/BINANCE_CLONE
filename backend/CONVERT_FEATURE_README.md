# Convert Feature - Bitby Cryptocurrency Exchange

This document describes the Convert feature implementation for the Bitby cryptocurrency exchange clone, which allows users to convert between different cryptocurrencies.

## Overview

The Convert feature provides three types of cryptocurrency conversions:
1. **Instant Convert** - Immediate conversion at current market price
2. **Limit Convert** - Conversion at a specific target price
3. **Recurring Convert** - Scheduled conversions at regular intervals

All conversions use real-time market data and are updated every minute to ensure accurate pricing.

## Features

### 1. Real-time Market Integration
- **Live Price Updates**: Uses current market prices from CoinGecko API
- **Automatic Refresh**: Market data updates every 5 minutes
- **Real-time Quotes**: Get instant conversion quotes with current rates
- **WebSocket Updates**: Real-time order status updates via WebSocket

### 2. Conversion Types

#### Instant Convert
- **Purpose**: Immediate conversion at current market price
- **Use Case**: When you want to convert immediately without waiting
- **Execution**: Order is executed immediately upon creation
- **Fee**: 0.1% conversion fee applied

#### Limit Convert
- **Purpose**: Convert when a specific price target is reached
- **Use Case**: When you want to convert at a better price
- **Execution**: Order executes automatically when target price is reached
- **Monitoring**: System checks every minute for price conditions
- **Expiration**: Orders can have an expiration date

#### Recurring Convert
- **Purpose**: Automatically convert at regular intervals
- **Use Case**: Dollar-cost averaging or regular portfolio rebalancing
- **Intervals**: Daily, Weekly, or Monthly
- **Execution**: Automatic execution at scheduled times
- **Limits**: Can set maximum number of executions

### 3. Order Management
- **Order History**: View all your conversion orders
- **Order Cancellation**: Cancel pending orders
- **Status Tracking**: Real-time order status updates
- **WebSocket Notifications**: Instant updates on order status changes

## API Endpoints

### 1. Get Conversion Quote
```http
POST /api/v1/convert/quote
Content-Type: application/json

{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1"
}
```

**Response:**
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

### 2. Instant Convert
```http
POST /api/v1/convert/instant
Authorization: Bearer YOUR_JWT_TOKEN
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
Authorization: Bearer YOUR_JWT_TOKEN
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
Authorization: Bearer YOUR_JWT_TOKEN
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
Authorization: Bearer YOUR_JWT_TOKEN
```

### 6. Cancel Order
```http
DELETE /api/v1/convert/orders/{orderId}
Authorization: Bearer YOUR_JWT_TOKEN
```

### 7. Get Convert Types
```http
GET /api/v1/convert/types
```

## Database Schema

### Convert Orders Table
```sql
CREATE TABLE convert_orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) NOT NULL,
    from_crypto_id BIGINT REFERENCES cryptocurrencies(id) NOT NULL,
    to_crypto_id BIGINT REFERENCES cryptocurrencies(id) NOT NULL,
    from_amount DECIMAL(20,8) NOT NULL,
    to_amount DECIMAL(20,8),
    exchange_rate DECIMAL(20,8),
    convert_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    target_price DECIMAL(20,8),
    recurring_interval VARCHAR(20),
    next_execution_time TIMESTAMP,
    last_execution_time TIMESTAMP,
    total_executions INTEGER DEFAULT 0,
    max_executions INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP,
    expires_at TIMESTAMP
);
```

## WebSocket Topics

### 1. Convert Order Updates
- **Topic**: `/topic/convert/{userId}`
- **Purpose**: User-specific convert order updates
- **Data**: ConvertOrder object

### 2. General Convert Updates
- **Topic**: `/topic/convert`
- **Purpose**: General convert order broadcasts
- **Data**: ConvertOrder object

### 3. Market Data Updates
- **Topic**: `/topic/market-data`
- **Purpose**: Real-time market data updates
- **Data**: List of MarketDataResponse objects

## Usage Examples

### JavaScript WebSocket Client
```javascript
// Connect to WebSocket
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    // Subscribe to user-specific convert updates
    stompClient.subscribe('/topic/convert/123', function (message) {
        const convertOrder = JSON.parse(message.body);
        console.log('Convert order updated:', convertOrder);
    });
    
    // Subscribe to market data updates
    stompClient.subscribe('/topic/market-data', function (message) {
        const marketData = JSON.parse(message.body);
        console.log('Market data updated:', marketData);
    });
});
```

### cURL Examples

#### Get Quote
```bash
curl -X POST "http://localhost:8080/api/v1/convert/quote" \
  -H "Content-Type: application/json" \
  -d '{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1"
  }'
```

#### Instant Convert
```bash
curl -X POST "http://localhost:8080/api/v1/convert/instant" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1",
    "convertType": "INSTANT"
  }'
```

#### Limit Convert
```bash
curl -X POST "http://localhost:8080/api/v1/convert/limit" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromSymbol": "BTC",
    "toSymbol": "ETH",
    "amount": "0.1",
    "convertType": "LIMIT",
    "targetPrice": "12.5",
    "expiresAt": "2024-01-20T10:30:00"
  }'
```

## Configuration

### Application Properties
```properties
# Convert Feature Configuration
convert.fee.percentage=0.001
convert.quote.expiration.minutes=1
convert.limit.check.interval.ms=60000
convert.recurring.check.interval.ms=60000
convert.expire.check.interval.ms=300000
```

### Scheduled Tasks
- **Limit Order Check**: Every 1 minute
- **Recurring Order Check**: Every 1 minute
- **Order Expiration Check**: Every 5 minutes
- **Market Data Update**: Every 5 minutes

## Security Considerations

- All convert endpoints require JWT authentication
- Users can only access their own orders
- Input validation for all request parameters
- Rate limiting should be implemented for production
- WebSocket connections are secured

## Error Handling

### Common Error Responses
```json
{
    "success": false,
    "message": "Error description"
}
```

### Error Types
- **Invalid Request**: Missing or invalid parameters
- **User Not Found**: Authentication issues
- **Cryptocurrency Not Found**: Invalid symbol
- **Insufficient Balance**: Not enough cryptocurrency (future feature)
- **Order Not Found**: Invalid order ID
- **Unauthorized**: User doesn't own the order

## Performance Considerations

- Real-time market data integration
- Efficient database queries with proper indexing
- WebSocket for real-time updates
- Scheduled tasks for order processing
- Quote caching for better performance

## Future Enhancements

1. **Balance Integration**: Connect with user wallet balances
2. **Advanced Limits**: Stop-loss and take-profit orders
3. **Portfolio Tracking**: Track conversion history and performance
4. **Fee Optimization**: Dynamic fee calculation based on volume
5. **Multi-pair Support**: Support for more trading pairs
6. **Mobile App**: Native mobile application
7. **Analytics**: Conversion analytics and reporting
8. **Notifications**: Email and push notifications for order updates

## Testing

### Manual Testing
1. Start the application
2. Get a JWT token by logging in
3. Test each convert type with different parameters
4. Monitor WebSocket updates
5. Check order execution and status updates

### Automated Testing
- Unit tests for service methods
- Integration tests for API endpoints
- WebSocket connection tests
- Scheduled task tests

## Troubleshooting

### Common Issues
1. **Orders Not Executing**: Check market data updates
2. **WebSocket Connection Failed**: Verify WebSocket configuration
3. **Invalid Quotes**: Check cryptocurrency symbols
4. **Authentication Errors**: Verify JWT token

### Logs
Check application logs for detailed error messages:
```bash
tail -f logs/application.log
```

The Convert feature provides a comprehensive solution for cryptocurrency conversions with real-time market data integration, multiple conversion types, and robust order management capabilities. 