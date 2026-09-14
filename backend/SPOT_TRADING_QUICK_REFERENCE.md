# Spot Trading - Quick Reference Card

## 🔑 **Authentication**
```bash
POST {{BASE_URL}}/api/v1/auth/login
{
    "email": "test@example.com",
    "password": "password123"
}
```

## 📊 **Phase 1: Basic Trading**

### **Trading Pairs**
- `GET /api/v1/trading/pairs` - All pairs
- `GET /api/v1/trading/pairs/BTCUSDT` - Specific pair
- `GET /api/v1/trading/pairs/BTCUSDT/ticker` - Ticker data

### **Basic Orders**
- `POST /api/v1/trading/orders` - Place order
- `GET /api/v1/trading/orders` - User orders
- `GET /api/v1/trading/orders/{id}` - Specific order
- `DELETE /api/v1/trading/orders/{id}` - Cancel order

### **Order Book & Trades**
- `GET /api/v1/trading/orderbook/BTCUSDT` - Order book
- `GET /api/v1/trading/trades` - User trades
- `GET /api/v1/trading/trades/BTCUSDT` - Recent trades

## ⚡ **Phase 2: Enhanced Features**

### **Order Matching Test**
1. Place buy order at 45000
2. Place sell order at 45000
3. Watch immediate execution

### **Partial Fill Test**
1. Place large buy order (0.005 BTC)
2. Place smaller sell order (0.002 BTC)
3. Verify partial fill

## 🔄 **Phase 3: Real-time Features**

### **WebSocket Connection**
```
ws://localhost:8080/ws/trading
```

### **WebSocket Subscriptions**
```json
// Order Book
{"type": "SUBSCRIBE", "topic": "ORDERBOOK", "symbol": "BTCUSDT"}

// User Orders
{"type": "SUBSCRIBE", "topic": "ORDERS", "userId": "{{USER_ID}}"}

// User Trades
{"type": "SUBSCRIBE", "topic": "USER_TRADES", "userId": "{{USER_ID}}"}

// Ticker
{"type": "SUBSCRIBE", "topic": "TICKER", "symbol": "BTCUSDT"}

// Balance
{"type": "SUBSCRIBE", "topic": "BALANCE", "userId": "{{USER_ID}}"}
```

## 🚀 **Phase 4: Advanced Orders**

### **Advanced Order Types**
```json
// Stop Limit
{
    "symbol": "BTCUSDT",
    "orderType": "STOP_LIMIT",
    "side": "SELL",
    "quantity": 0.001,
    "price": 45000.00,
    "stopPrice": 46000.00
}

// GTD (Good Till Date)
{
    "symbol": "BTCUSDT",
    "orderType": "GTD",
    "side": "BUY",
    "quantity": 0.001,
    "price": 44000.00,
    "expirationTime": "2024-12-31T23:59:59"
}

// Trailing Stop
{
    "symbol": "BTCUSDT",
    "orderType": "TRAILING_STOP",
    "side": "SELL",
    "quantity": 0.001,
    "trailingStopDistance": 1000.00
}

// IOC (Immediate or Cancel)
{
    "symbol": "BTCUSDT",
    "orderType": "IOC",
    "side": "BUY",
    "quantity": 0.001,
    "price": 45000.00
}

// FOK (Fill or Kill)
{
    "symbol": "BTCUSDT",
    "orderType": "FOK",
    "side": "BUY",
    "quantity": 0.001,
    "price": 45000.00
}
```

### **Advanced Order Management**
- `POST /api/v1/trading/advanced/orders` - Place advanced order
- `PUT /api/v1/trading/advanced/orders/modify` - Modify order
- `POST /api/v1/trading/advanced/orders/bulk` - Bulk orders
- `DELETE /api/v1/trading/advanced/orders/all` - Cancel all orders

### **Order Filtering**
- `GET /api/v1/trading/advanced/orders/status/PENDING` - By status
- `GET /api/v1/trading/advanced/orders/symbol/BTCUSDT` - By symbol
- `GET /api/v1/trading/advanced/orders/type/STOP_LIMIT` - By type
- `GET /api/v1/trading/advanced/orders/stop-orders` - Stop orders
- `GET /api/v1/trading/advanced/orders/expired` - Expired orders

### **Order Statistics**
- `GET /api/v1/trading/advanced/statistics` - User statistics

### **Bulk Cancellation**
- `DELETE /api/v1/trading/advanced/orders/symbol/BTCUSDT` - By symbol
- `DELETE /api/v1/trading/advanced/orders/type/STOP_LIMIT` - By type

## 🧪 **Testing Scenarios**

### **Basic Flow**
1. Get trading pairs
2. Place limit buy order
3. Place limit sell order (matching price)
4. Check trade execution
5. Verify balance updates

### **Advanced Flow**
1. Place stop limit order
2. Place GTD order
3. Modify existing order
4. Place bulk orders
5. Check order statistics
6. Cancel orders by type

### **Real-time Flow**
1. Connect WebSocket
2. Subscribe to updates
3. Place orders via REST API
4. Monitor real-time updates
5. Verify WebSocket notifications

### **Error Testing**
1. Place invalid order (wrong symbol)
2. Place order with insufficient balance
3. Modify non-existent order
4. Use expired token

## 📋 **Sample Data**

### **Trading Pairs**
- BTCUSDT (Bitcoin/USDT)
- ETHUSDT (Ethereum/USDT)
- BNBUSDT (Binance Coin/USDT)
- BTCGHS (Bitcoin/Ghana Cedi)
- ETHGHS (Ethereum/Ghana Cedi)

### **Order Types**
- MARKET (immediate execution)
- LIMIT (price-based execution)
- STOP_LIMIT (stop-triggered limit)
- STOP_MARKET (stop-triggered market)
- TRAILING_STOP (dynamic stop)
- GTD (Good Till Date)
- IOC (Immediate or Cancel)
- FOK (Fill or Kill)

### **Order Status**
- PENDING (waiting to be matched)
- PARTIAL_FILLED (partially executed)
- FILLED (completely executed)
- CANCELLED (user cancelled)
- REJECTED (system rejected)
- EXPIRED (time expired)
- TRIGGERED (stop order triggered)
- KILLED (IOC/FOK not fully filled)

## 🔧 **Common Headers**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

## 📊 **Expected Response Format**
```json
{
    "id": 1,
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "BUY",
    "quantity": "0.001",
    "price": "45000.00",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00"
}
```

## 🚨 **Troubleshooting**

### **Common Issues**
- **401 Unauthorized**: Check JWT token
- **400 Bad Request**: Validate request body
- **404 Not Found**: Check order ID or symbol
- **409 Conflict**: Insufficient balance
- **422 Unprocessable**: Invalid order parameters

### **WebSocket Issues**
- **Connection failed**: Check if app is running
- **No messages**: Verify subscription format
- **Disconnection**: Check network stability

---

**Use this quick reference for efficient testing of all spot trading features!** 🎯 