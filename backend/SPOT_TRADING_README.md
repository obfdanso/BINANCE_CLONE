# Spot Trading Feature - Bitby Cryptocurrency Exchange

This document describes the spot trading feature implementation for the Bitby cryptocurrency exchange clone.

## Overview

The spot trading feature provides a complete order book-based trading system similar to Binance, allowing users to place market and limit orders, view order books, and track their trading history. All trading is done with dummy funds for educational purposes.

## Features Implemented

### 1. Trading Pairs Management
- **Default Trading Pairs**: BTC/USDT, ETH/USDT, BNB/USDT, BTC/GHS, ETH/GHS
- **Trading Pair Configuration**: Min/max order sizes, price precision, trading fees
- **Real-time Market Data**: Integration with existing CoinGecko API for live prices

### 2. Order Types
- **Market Orders**: Execute immediately at best available price
- **Limit Orders**: Execute only at specified price or better
- **Stop Orders**: Placeholder for future implementation (STOP_LIMIT, STOP_MARKET)

### 3. Order Management
- **Order Placement**: Create buy/sell orders with validation
- **Order Cancellation**: Cancel pending orders with balance refund
- **Order Status Tracking**: PENDING, PARTIAL_FILLED, FILLED, CANCELLED, REJECTED
- **Order History**: View all user orders with detailed information

### 4. Order Matching Engine
- **Price-Time Priority**: Orders are matched based on price and time
- **Real-time Matching**: Immediate order matching for market orders
- **Partial Fills**: Support for partial order execution
- **Fee Calculation**: Maker (0.05%) and taker (0.1%) fees

### 5. Order Book
- **Real-time Order Book**: Live bid/ask orders with aggregated quantities
- **Order Book Depth**: Configurable depth for order book display
- **Price Levels**: Aggregated orders at each price level

### 6. Trade History
- **Trade Recording**: Complete trade history with maker/taker information
- **User Trade History**: Individual user trade history
- **Recent Trades**: Recent trades for each trading pair

## API Endpoints

### Trading Pairs
- `GET /api/v1/trading/pairs` - Get all active trading pairs
- `GET /api/v1/trading/pairs/{symbol}` - Get specific trading pair
- `GET /api/v1/trading/pairs/{symbol}/ticker` - Get 24h ticker

### Orders
- `POST /api/v1/trading/orders` - Place new order
- `GET /api/v1/trading/orders` - Get user orders
- `GET /api/v1/trading/orders/{orderId}` - Get specific order
- `DELETE /api/v1/trading/orders/{orderId}` - Cancel order

### Order Book
- `GET /api/v1/trading/orderbook/{symbol}` - Get order book

### Trades
- `GET /api/v1/trading/trades` - Get user trades
- `GET /api/v1/trading/trades/{symbol}` - Get recent trades for pair

## Database Schema

### Trading Pairs Table
```sql
CREATE TABLE trading_pairs (
    id BIGSERIAL PRIMARY KEY,
    base_asset VARCHAR(10) NOT NULL,
    quote_asset VARCHAR(10) NOT NULL,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    min_order_size DECIMAL(20,8),
    max_order_size DECIMAL(20,8),
    price_precision INTEGER DEFAULT 2,
    quantity_precision INTEGER DEFAULT 6,
    trading_fee DECIMAL(5,4) DEFAULT 0.001,
    maker_fee DECIMAL(5,4) DEFAULT 0.0005,
    taker_fee DECIMAL(5,4) DEFAULT 0.001,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    trading_pair_id BIGINT REFERENCES trading_pairs(id),
    order_type VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8),
    stop_price DECIMAL(20,8),
    filled_quantity DECIMAL(20,8) DEFAULT 0,
    remaining_quantity DECIMAL(20,8),
    average_price DECIMAL(20,8),
    status VARCHAR(20) NOT NULL,
    total_fee DECIMAL(20,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP
);
```

### Trades Table
```sql
CREATE TABLE trades (
    id BIGSERIAL PRIMARY KEY,
    trading_pair_id BIGINT REFERENCES trading_pairs(id),
    maker_order_id BIGINT REFERENCES orders(id),
    taker_order_id BIGINT REFERENCES orders(id),
    maker_user_id BIGINT REFERENCES users(id),
    taker_user_id BIGINT REFERENCES users(id),
    price DECIMAL(20,8) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    maker_fee DECIMAL(20,8),
    taker_fee DECIMAL(20,8),
    total_value DECIMAL(20,8),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Book Entries Table
```sql
CREATE TABLE order_book_entries (
    id BIGSERIAL PRIMARY KEY,
    trading_pair_id BIGINT REFERENCES trading_pairs(id),
    side VARCHAR(10) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    total_quantity DECIMAL(20,8) NOT NULL,
    order_count INTEGER NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Examples

### 1. Place a Limit Buy Order
```bash
curl -X POST "http://localhost:8080/api/v1/trading/orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "BUY",
    "quantity": 0.001,
    "price": 45000.00
  }'
```

### 2. Place a Market Sell Order
```bash
curl -X POST "http://localhost:8080/api/v1/trading/orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTCUSDT",
    "orderType": "MARKET",
    "side": "SELL",
    "quantity": 0.001
  }'
```

### 3. Get Order Book
```bash
curl -X GET "http://localhost:8080/api/v1/trading/orderbook/BTCUSDT?depth=10"
```

### 4. Cancel an Order
```bash
curl -X DELETE "http://localhost:8080/api/v1/trading/orders/123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get User Orders
```bash
curl -X GET "http://localhost:8080/api/v1/trading/orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Order Types and Parameters

### Market Orders
- **Purpose**: Execute immediately at best available price
- **Required**: `symbol`, `orderType: "MARKET"`, `side`, `quantity`
- **Optional**: `price` (for estimation purposes)
- **Fee**: Taker fee (0.1%)

### Limit Orders
- **Purpose**: Execute only at specified price or better
- **Required**: `symbol`, `orderType: "LIMIT"`, `side`, `quantity`, `price`
- **Fee**: Maker fee (0.05%) if not immediately matched, taker fee (0.1%) if matched

### Stop Orders (Future Implementation)
- **STOP_LIMIT**: Triggers limit order when stop price is reached
- **STOP_MARKET**: Triggers market order when stop price is reached

## Order Status Flow

1. **PENDING**: Order created, waiting to be matched
2. **PARTIAL_FILLED**: Order partially executed
3. **FILLED**: Order completely executed
4. **CANCELLED**: Order cancelled by user
5. **REJECTED**: Order rejected due to validation errors

## Fee Structure

- **Maker Fee**: 0.05% (for orders that add liquidity to the order book)
- **Taker Fee**: 0.1% (for orders that remove liquidity from the order book)
- **Market Orders**: Always charged taker fee
- **Limit Orders**: Maker fee if not immediately matched, taker fee if matched

## Balance Management

The system integrates with your existing user balance system:
- **Base Assets**: BTC, ETH, BNB, USDT (stored in User model)
- **Quote Assets**: USDT, USD, GHS (stored in User model)
- **Balance Validation**: Checks sufficient balance before order placement
- **Balance Updates**: Updates balances after trade execution

## Testing

### Test Script
Use the provided test script: `test_spot_trading.bat`

### Manual Testing Steps
1. **Start the application** - Trading pairs will be automatically initialized
2. **Get JWT token** - Login to get authentication token
3. **Test trading pairs** - Verify trading pairs are available
4. **Place test orders** - Create limit and market orders
5. **Check order book** - Verify orders appear in order book
6. **Execute trades** - Place matching orders to trigger trades
7. **Verify balances** - Check that balances are updated correctly

## Architecture

### Components
1. **SpotTradingService** - Core trading logic and order management
2. **TradingPairService** - Trading pair management and initialization
3. **SpotTradingController** - REST API endpoints
4. **OrderRepository** - Database operations for orders
5. **TradeRepository** - Database operations for trades
6. **OrderBookEntryRepository** - Order book management

### Data Flow
1. **Order Placement** → Validation → Balance Check → Order Creation → Matching
2. **Order Matching** → Trade Execution → Balance Updates → Order Book Update
3. **Order Cancellation** → Balance Refund → Status Update → Order Book Update

## Security Considerations

- All endpoints require JWT authentication
- User can only access their own orders and trades
- Balance validation prevents overspending
- Order validation ensures data integrity

## Phase 3: Advanced Features (Implemented)

### 1. **Order Book Persistence** ✅
- **Database Storage**: Order book entries stored in `order_book_entries` table
- **Real-time Updates**: Order book updates automatically when orders are placed/cancelled/filled
- **Aggregation**: Orders at same price level are aggregated with total quantity and order count
- **Maintenance**: Scheduled tasks for order book rebuilding and integrity validation

### 2. **WebSocket Real-time Updates** ✅
- **Order Book Updates**: Real-time order book changes broadcast to subscribers
- **Trade Execution**: Instant trade notifications to all connected clients
- **User Updates**: Individual user order and trade updates
- **Ticker Updates**: Real-time trading pair ticker information
- **Balance Updates**: User balance changes after trades

### 3. **Order Book Maintenance** ✅
- **Scheduled Rebuilding**: Automatic order book rebuild every 5 minutes
- **Integrity Validation**: Periodic checks for order book consistency
- **Stale Entry Cleanup**: Removal of zero-quantity entries
- **Error Handling**: Comprehensive error handling and logging

### 4. **Enhanced Order Management** ✅
- **Real-time Order Updates**: WebSocket notifications for order status changes
- **Trade Broadcasting**: Instant trade execution notifications
- **User-specific Updates**: Personalized updates for each user
- **Order Book Integration**: Seamless integration with order book persistence

## Phase 4: Advanced Order Types & Trading Features (Implemented)

### 1. **Advanced Order Types** ✅
- **Stop Orders**: STOP_LIMIT, STOP_MARKET, TRAILING_STOP
- **Time-Based Orders**: GTD (Good Till Date), IOC (Immediate or Cancel), FOK (Fill or Kill)
- **Enhanced Order Model**: New fields for trigger prices, trailing stops, expiration times

### 2. **Automated Order Processing** ✅
- **Stop Order Engine**: Every 10 seconds - monitors and triggers stop orders
- **Trailing Stop Engine**: Every 5 seconds - updates trailing stop levels
- **Expiration Engine**: Every 30 seconds - handles GTD order expiration
- **Real-time Processing**: Automatic order state management

### 3. **Enhanced Order Management** ✅
- **Order Modification**: Modify price, quantity, stop price, expiration time
- **Bulk Operations**: Place multiple orders with strategy support (GRID, DCA, ARBITRAGE)
- **Advanced Filtering**: Filter by status, symbol, type, stop orders, expired orders
- **Order Statistics**: Comprehensive user order statistics

### 4. **New API Endpoints** ✅
- **Advanced Orders**: `/api/v1/trading/advanced/orders` - Advanced order placement
- **Order Modification**: `/api/v1/trading/advanced/orders/modify` - Modify existing orders
- **Bulk Operations**: `/api/v1/trading/advanced/orders/bulk` - Bulk order placement
- **Order Management**: `/api/v1/trading/advanced/orders/all` - Cancel all orders
- **Statistics**: `/api/v1/trading/advanced/statistics` - Order statistics

## WebSocket Topics

### Order Book Updates
- `/topic/trading/orderbook/{symbol}` - Real-time order book updates
- `/topic/trading/orderbook/{symbol}/depth/{depth}` - Specific depth order book

### Trade Updates
- `/topic/trading/trades/{symbol}` - Recent trades for trading pair
- `/topic/trading/user-trades/{userId}` - User-specific trade updates

### Order Updates
- `/topic/trading/orders/{userId}` - User order status updates
- `/topic/trading/order/{orderId}` - Specific order updates

### Ticker Updates
- `/topic/trading/ticker/{symbol}` - Trading pair ticker information

### Balance Updates
- `/topic/trading/balance/{userId}` - User balance changes

## WebSocket Testing

Use the provided `test_websocket_trading.html` file to test real-time features:

1. **Open the HTML file** in your browser
2. **Connect to WebSocket** using the connect button
3. **Subscribe to updates** for specific trading pairs
4. **Place orders via API** and watch real-time updates
5. **Monitor order book changes** in real-time

## Future Enhancements

1. **Stop Orders**: Implement STOP_LIMIT and STOP_MARKET orders
2. **Advanced Order Types**: IOC (Immediate or Cancel), FOK (Fill or Kill)
3. **Trading Bots**: API for automated trading
4. **Portfolio Management**: Advanced portfolio tracking
5. **Risk Management**: Position limits and risk controls
6. **Market Making**: Automated market making strategies
7. **Advanced Analytics**: Trading analytics and reporting

## Troubleshooting

### Common Issues
1. **Insufficient Balance**: Check user balances before placing orders
2. **Invalid Trading Pair**: Ensure trading pair symbol is correct
3. **Authentication Errors**: Verify JWT token is valid and not expired
4. **Order Not Found**: Check order ID and user ownership

### Logs
Check application logs for detailed error messages:
```bash
tail -f logs/application.log
```

## Performance Considerations

- Order matching is optimized for real-time performance
- Database queries are optimized with proper indexing
- Order book updates are batched for efficiency
- Balance updates are atomic to prevent race conditions

This spot trading feature provides a solid foundation for a cryptocurrency exchange platform, offering realistic trading mechanics with dummy funds for safe learning and testing. 