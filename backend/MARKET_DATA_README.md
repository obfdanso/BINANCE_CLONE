# Market Data Feature - Bitby Cryptocurrency Exchange

This document describes the market data feature implementation for the Bitby cryptocurrency exchange clone.

## Overview

The market data feature provides real-time cryptocurrency price information, historical data, and user watchlist functionality. It integrates with external APIs (CoinGecko) to fetch live market data and stores it in the local database for quick access.

## Features Implemented

### 1. Real-time Market Data
- **Live Price Updates**: Fetches current prices, 24h changes, market cap, volume, and high/low prices
- **Scheduled Updates**: Automatically updates market data every 5 minutes
- **WebSocket Support**: Real-time price updates via WebSocket connections
- **Top 100 Cryptocurrencies**: Automatically fetches and tracks the top 100 cryptocurrencies by market cap

### 2. Market Data Endpoints
- `GET /api/v1/market/all` - Get all market data
- `GET /api/v1/market/crypto/{symbol}` - Get specific cryptocurrency data
- `GET /api/v1/market/top/market-cap` - Top cryptocurrencies by market cap
- `GET /api/v1/market/top/gainers` - Top gainers (24h)
- `GET /api/v1/market/top/losers` - Top losers (24h)
- `GET /api/v1/market/crypto/{symbol}/history` - Price history for a cryptocurrency
- `POST /api/v1/market/refresh` - Manually refresh market data
- `GET /api/v1/market/search` - Search cryptocurrencies

### 3. User Watchlist
- **Add to Watchlist**: `POST /api/v1/watchlist/add`
- **Remove from Watchlist**: `DELETE /api/v1/watchlist/remove/{symbol}`
- **Get User's Watchlist**: `GET /api/v1/watchlist`
- **Check Watchlist Status**: `GET /api/v1/watchlist/check/{symbol}`

### 4. WebSocket Real-time Updates
- **Market Data Broadcast**: `/topic/market-data`
- **Individual Crypto Updates**: `/topic/crypto/{symbol}`
- **Price Alerts**: `/topic/alerts/{symbol}`

## Database Schema

### Cryptocurrency Table
```sql
CREATE TABLE cryptocurrencies (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    current_price DECIMAL(20,8),
    price_change_24h DECIMAL(20,8),
    price_change_percentage_24h DECIMAL(10,4),
    market_cap DECIMAL(20,8),
    volume_24h DECIMAL(20,8),
    high_24h DECIMAL(20,8),
    low_24h DECIMAL(20,8),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP
);
```

### Price History Table
```sql
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    cryptocurrency_id BIGINT REFERENCES cryptocurrencies(id),
    price DECIMAL(20,8) NOT NULL,
    volume DECIMAL(20,8),
    timestamp TIMESTAMP NOT NULL,
    interval VARCHAR(20) DEFAULT 'HOURLY'
);
```

### Watchlist Table
```sql
CREATE TABLE watchlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    cryptocurrency_id BIGINT REFERENCES cryptocurrencies(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Price Alert Table
```sql
CREATE TABLE price_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    cryptocurrency_id BIGINT REFERENCES cryptocurrencies(id),
    target_price DECIMAL(20,8) NOT NULL,
    alert_type VARCHAR(10) NOT NULL, -- 'ABOVE' or 'BELOW'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP
);
```

## Configuration

### Application Properties
```properties
# Market Data Configuration
market.data.update.interval=300000
market.data.api.coingecko.base-url=https://api.coingecko.com/api/v3
```

### Dependencies Added
- `spring-boot-starter-websocket` - WebSocket support
- `spring-boot-starter-webflux` - HTTP client for external APIs
- `jackson-databind` - JSON processing

## Usage Examples

### 1. Get All Market Data
```bash
curl -X GET "http://localhost:8080/api/v1/market/all"
```

### 2. Get Specific Cryptocurrency
```bash
curl -X GET "http://localhost:8080/api/v1/market/crypto/BTC"
```

### 3. Get Top Gainers
```bash
curl -X GET "http://localhost:8080/api/v1/market/top/gainers?limit=5"
```

### 4. Add to Watchlist (requires authentication)
```bash
curl -X POST "http://localhost:8080/api/v1/watchlist/add" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTC"}'
```

### 5. WebSocket Connection
```javascript
// Connect to WebSocket
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    // Subscribe to market data updates
    stompClient.subscribe('/topic/market-data', function (message) {
        const marketData = JSON.parse(message.body);
        console.log('Market data updated:', marketData);
    });
    
    // Subscribe to specific cryptocurrency updates
    stompClient.subscribe('/topic/crypto/btc', function (message) {
        const btcData = JSON.parse(message.body);
        console.log('BTC updated:', btcData);
    });
});
```

## Testing

### Web Interface
Access the market data web interface at: `http://localhost:8080/market-data.html`

### API Documentation
Swagger UI is available at: `http://localhost:8080/swagger-ui.html`

## Architecture

### Components
1. **MarketDataService** - Core service for fetching and managing market data
2. **WebSocketService** - Handles real-time updates via WebSocket
3. **WatchlistService** - Manages user watchlists
4. **MarketDataController** - REST API endpoints
5. **WatchlistController** - Watchlist management endpoints

### Data Flow
1. **Scheduled Task** → Fetches data from CoinGecko API every 5 minutes
2. **Database Storage** → Stores current prices and historical data
3. **WebSocket Broadcast** → Sends real-time updates to connected clients
4. **REST API** → Provides market data to frontend applications

## Security Considerations

- All watchlist endpoints require JWT authentication
- WebSocket connections are secured
- API rate limiting should be implemented for production
- External API calls are handled with proper error handling

## Future Enhancements

1. **Price Alerts**: Implement the price alert functionality
2. **Advanced Charts**: Integrate charting libraries for price visualization
3. **Portfolio Tracking**: Add portfolio management features
4. **News Integration**: Include cryptocurrency news and updates
5. **Trading Pairs**: Support for different trading pairs (BTC/USDT, ETH/BTC, etc.)
6. **Customizable Limits**: Allow users to configure the number of cryptocurrencies to track

## Troubleshooting

### Common Issues
1. **No Market Data**: Check if the CoinGecko API is accessible
2. **WebSocket Connection Failed**: Verify WebSocket configuration
3. **Database Connection**: Ensure PostgreSQL is running and accessible
4. **Authentication Errors**: Verify JWT token is valid and not expired

### Logs
Check application logs for detailed error messages:
```bash
tail -f logs/application.log
```

## Performance Considerations

- Market data is cached in the database to reduce API calls
- WebSocket connections are optimized for real-time updates
- Database queries are optimized with proper indexing
- External API calls are made asynchronously to avoid blocking

This market data feature provides a solid foundation for a cryptocurrency exchange platform, offering real-time data, user personalization, and scalability for future enhancements. 