# Spot Trading API - Complete Postman Testing Guide

## Overview
This guide provides comprehensive testing scenarios for the Bitby Spot Trading feature, covering all phases from basic order placement to advanced order types and real-time WebSocket updates.

## 🚀 **Quick Start**

### **1. Environment Setup**
Create a new Postman environment with these variables:
```
BASE_URL: http://localhost:8080
TOKEN: (leave empty - will be set after login)
USER_ID: (leave empty - will be set after login)
```

### **2. Authentication**
First, authenticate to get your JWT token:
```
POST {{BASE_URL}}/api/v1/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

Set the `TOKEN` environment variable from the response.

---

## 📋 **Phase 1: Basic Trading Operations**

### **1.1 Trading Pairs Management**

#### **Get All Trading Pairs**
```
GET {{BASE_URL}}/api/v1/trading/pairs
Authorization: Bearer {{TOKEN}}
```

#### **Get Specific Trading Pair**
```
GET {{BASE_URL}}/api/v1/trading/pairs/BTCUSDT
Authorization: Bearer {{TOKEN}}
```

#### **Get Trading Pair Ticker**
```
GET {{BASE_URL}}/api/v1/trading/pairs/BTCUSDT/ticker
Authorization: Bearer {{TOKEN}}
```

### **1.2 Basic Order Placement**

#### **Place Market Buy Order**
```
POST {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "MARKET",
    "side": "BUY",
    "quantity": 0.001
}
```

#### **Place Limit Buy Order**
```
POST {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "BUY",
    "quantity": 0.001,
    "price": 45000.00
}
```

#### **Place Limit Sell Order**
```
POST {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "SELL",
    "quantity": 0.001,
    "price": 46000.00
}
```

### **1.3 Order Management**

#### **Get User Orders**
```
GET {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
```

#### **Get Specific Order**
```
GET {{BASE_URL}}/api/v1/trading/orders/{{ORDER_ID}}
Authorization: Bearer {{TOKEN}}
```

#### **Cancel Order**
```
DELETE {{BASE_URL}}/api/v1/trading/orders/{{ORDER_ID}}
Authorization: Bearer {{TOKEN}}
```

### **1.4 Order Book**

#### **Get Order Book**
```
GET {{BASE_URL}}/api/v1/trading/orderbook/BTCUSDT?depth=10
Authorization: Bearer {{TOKEN}}
```

### **1.5 Trade History**

#### **Get User Trades**
```
GET {{BASE_URL}}/api/v1/trading/trades
Authorization: Bearer {{TOKEN}}
```

#### **Get Recent Trades for Pair**
```
GET {{BASE_URL}}/api/v1/trading/trades/BTCUSDT?limit=20
Authorization: Bearer {{TOKEN}}
```

---

## 🔄 **Phase 2: Enhanced Order Management**

### **2.1 Advanced Order Matching**

#### **Place Orders for Matching Test**
```
POST {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "BUY",
    "quantity": 0.002,
    "price": 45000.00
}
```

Then immediately place a matching sell order:
```
POST {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "SELL",
    "quantity": 0.001,
    "price": 45000.00
}
```

### **2.2 Partial Fill Testing**

#### **Place Large Buy Order**
```
POST {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "BUY",
    "quantity": 0.005,
    "price": 45000.00
}
```

#### **Place Smaller Sell Order (Partial Fill)**
```
POST {{BASE_URL}}/api/v1/trading/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "SELL",
    "quantity": 0.002,
    "price": 45000.00
}
```

---

## ⚡ **Phase 3: Real-time Features**

### **3.1 WebSocket Testing with STOMP**

#### **WebSocket Connection URL**
```
ws://localhost:8080/ws/websocket
```

#### **Using STOMP Protocol**
The backend uses STOMP protocol over WebSocket. When testing with Postman, you need to format your messages as STOMP frames.

#### **Authentication (Connect Frame)**
```
CONNECT
Authorization:Bearer {{TOKEN}}

```

> Note: The empty line at the end of the STOMP frame is required.

#### **Subscribe to Order Book Updates**
```
SUBSCRIBE
id:sub-orderbook
destination:/topic/orderbook/BTCUSDT

```

#### **Send Order Book Subscription Request with Depth**
```
SEND
destination:/app/orderbook/subscribe
content-type:application/json

{"symbol":"BTCUSDT","depth":10}
```

#### **Subscribe to User Orders**
```
SUBSCRIBE
id:sub-orders
destination:/user/topic/orders

```

#### **Subscribe to User Trades**
```
SUBSCRIBE
id:sub-trades
destination:/user/topic/trades

```

#### **Subscribe to Ticker Updates**
```
SUBSCRIBE
id:sub-ticker
destination:/topic/ticker/BTCUSDT

```

#### **Subscribe to Balance Updates**
```
SUBSCRIBE
id:sub-balance
destination:/user/topic/balance

```

### **3.2 Real-time Order Testing**

1. **Connect to WebSocket** using the connection URL and STOMP CONNECT frame with authorization header
2. **Subscribe to order updates** using STOMP SUBSCRIBE frame for your user
3. **Place an order** using the REST API
4. **Watch real-time updates** in the WebSocket connection

### **3.3 STOMP WebSocket Tips**

#### **Working with STOMP Frames in Postman**
- Each STOMP frame must start with a command (CONNECT, SUBSCRIBE, SEND, etc.)
- Headers follow the command (one per line)
- A blank line separates headers from the body
- End each frame with a null byte character (`\0`), though Postman usually handles this automatically

#### **Extracting JSON from STOMP Messages**
When you receive messages, they will be in STOMP format with JSON in the body:
```
MESSAGE
subscription:sub-orders
message-id:123
destination:/user/topic/orders
content-type:application/json
content-length:146

{"type":"ORDER_UPDATE","data":{"orderId":1,"status":"FILLED","filledQuantity":"0.001","averagePrice":"45000.00"},"timestamp":"2024-01-15T10:30:00"}
```

You'll need to extract the JSON body from the message to process it.

---

## 🚀 **Phase 4: Advanced Order Types**

### **4.1 Stop Orders**

#### **Place Stop Limit Order**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "STOP_LIMIT",
    "side": "SELL",
    "quantity": 0.001,
    "price": 45000.00,
    "stopPrice": 46000.00
}
```

#### **Place Stop Market Order**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "STOP_MARKET",
    "side": "SELL",
    "quantity": 0.001,
    "stopPrice": 46000.00
}
```

#### **Place Trailing Stop Order**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "TRAILING_STOP",
    "side": "SELL",
    "quantity": 0.001,
    "trailingStopDistance": 1000.00
}
```

### **4.2 Time-Based Orders**

#### **Place GTD (Good Till Date) Order**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "GTD",
    "side": "BUY",
    "quantity": 0.001,
    "price": 44000.00,
    "expirationTime": "2024-12-31T23:59:59"
}
```

#### **Place IOC (Immediate or Cancel) Order**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "IOC",
    "side": "BUY",
    "quantity": 0.001,
    "price": 45000.00
}
```

#### **Place FOK (Fill or Kill) Order**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "symbol": "BTCUSDT",
    "orderType": "FOK",
    "side": "BUY",
    "quantity": 0.001,
    "price": 45000.00
}
```

### **4.3 Order Modification**

#### **Modify Order Price**
```
PUT {{BASE_URL}}/api/v1/trading/advanced/orders/modify
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "orderId": "{{ORDER_ID}}",
    "newPrice": 44000.00,
    "reason": "Price adjustment"
}
```

#### **Modify Order Quantity**
```
PUT {{BASE_URL}}/api/v1/trading/advanced/orders/modify
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "orderId": "{{ORDER_ID}}",
    "newQuantity": 0.002,
    "reason": "Quantity increase"
}
```

#### **Modify Stop Price**
```
PUT {{BASE_URL}}/api/v1/trading/advanced/orders/modify
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "orderId": "{{ORDER_ID}}",
    "newStopPrice": 47000.00,
    "reason": "Stop price adjustment"
}
```

### **4.4 Bulk Order Operations**

#### **Place Bulk Orders (Grid Strategy)**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders/bulk
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "orders": [
        {
            "symbol": "BTCUSDT",
            "orderType": "LIMIT",
            "side": "BUY",
            "quantity": 0.001,
            "price": 44000.00
        },
        {
            "symbol": "BTCUSDT",
            "orderType": "LIMIT",
            "side": "BUY",
            "quantity": 0.001,
            "price": 43000.00
        },
        {
            "symbol": "BTCUSDT",
            "orderType": "LIMIT",
            "side": "SELL",
            "quantity": 0.001,
            "price": 46000.00
        },
        {
            "symbol": "BTCUSDT",
            "orderType": "LIMIT",
            "side": "SELL",
            "quantity": 0.001,
            "price": 47000.00
        }
    ],
    "strategy": "GRID",
    "clientBatchId": "grid_001"
}
```

#### **Place Bulk Orders (DCA Strategy)**
```
POST {{BASE_URL}}/api/v1/trading/advanced/orders/bulk
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "orders": [
        {
            "symbol": "BTCUSDT",
            "orderType": "LIMIT",
            "side": "BUY",
            "quantity": 0.001,
            "price": 45000.00
        },
        {
            "symbol": "BTCUSDT",
            "orderType": "LIMIT",
            "side": "BUY",
            "quantity": 0.001,
            "price": 44000.00
        },
        {
            "symbol": "BTCUSDT",
            "orderType": "LIMIT",
            "side": "BUY",
            "quantity": 0.001,
            "price": 43000.00
        }
    ],
    "strategy": "DCA",
    "clientBatchId": "dca_001"
}
```

### **4.5 Advanced Order Filtering**

#### **Get Orders by Status**
```
GET {{BASE_URL}}/api/v1/trading/advanced/orders/status/PENDING
Authorization: Bearer {{TOKEN}}
```

#### **Get Orders by Symbol**
```
GET {{BASE_URL}}/api/v1/trading/advanced/orders/symbol/BTCUSDT
Authorization: Bearer {{TOKEN}}
```

#### **Get Orders by Type**
```
GET {{BASE_URL}}/api/v1/trading/advanced/orders/type/STOP_LIMIT
Authorization: Bearer {{TOKEN}}
```

#### **Get Pending Stop Orders**
```
GET {{BASE_URL}}/api/v1/trading/advanced/orders/stop-orders
Authorization: Bearer {{TOKEN}}
```

#### **Get Expired Orders**
```
GET {{BASE_URL}}/api/v1/trading/advanced/orders/expired
Authorization: Bearer {{TOKEN}}
```

### **4.6 Order Statistics**

#### **Get Order Statistics**
```
GET {{BASE_URL}}/api/v1/trading/advanced/statistics
Authorization: Bearer {{TOKEN}}
```

### **4.7 Bulk Order Cancellation**

#### **Cancel All Orders**
```
DELETE {{BASE_URL}}/api/v1/trading/advanced/orders/all
Authorization: Bearer {{TOKEN}}
```

#### **Cancel Orders by Symbol**
```
DELETE {{BASE_URL}}/api/v1/trading/advanced/orders/symbol/ETHUSDT
Authorization: Bearer {{TOKEN}}
```

#### **Cancel Orders by Type**
```
DELETE {{BASE_URL}}/api/v1/trading/advanced/orders/type/STOP_LIMIT
Authorization: Bearer {{TOKEN}}
```

---

## 🧪 **Comprehensive Testing Scenarios**

### **Scenario 1: Basic Trading Flow**
1. **Get trading pairs** → Verify available pairs
2. **Get order book** → Check current market depth
3. **Place limit buy order** → Verify order creation
4. **Place limit sell order** → Trigger order matching
5. **Check trade history** → Verify trade execution
6. **Check user orders** → Verify order status updates

### **Scenario 2: Advanced Order Types**
1. **Place stop limit order** → Verify stop order creation
2. **Place GTD order** → Verify time-based order
3. **Place trailing stop order** → Verify trailing stop creation
4. **Modify existing order** → Verify order modification
5. **Check order statistics** → Verify statistics accuracy

### **Scenario 3: Real-time Testing**
1. **Connect to WebSocket** → Establish real-time connection
2. **Subscribe to updates** → Subscribe to relevant topics
3. **Place orders via REST API** → Trigger real-time events
4. **Monitor WebSocket messages** → Verify real-time updates
5. **Test order modifications** → Verify real-time notifications

### **Scenario 4: Bulk Operations**
1. **Place bulk orders** → Verify batch order placement
2. **Check order status** → Verify all orders created
3. **Cancel orders by symbol** → Verify bulk cancellation
4. **Check remaining orders** → Verify cancellation accuracy

### **Scenario 5: Error Handling**
1. **Place invalid order** → Test validation errors
2. **Modify non-existent order** → Test error responses
3. **Place order with insufficient balance** → Test balance validation
4. **Use invalid trading pair** → Test pair validation

---

## 📊 **Expected Responses**

### **Successful Order Placement**
```json
{
    "id": 1,
    "symbol": "BTCUSDT",
    "orderType": "LIMIT",
    "side": "BUY",
    "quantity": "0.001",
    "price": "45000.00",
    "stopPrice": null,
    "filledQuantity": "0.000",
    "remainingQuantity": "0.001",
    "averagePrice": null,
    "status": "PENDING",
    "totalFee": "0.000",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00",
    "executedAt": null
}
```

### **Order Statistics Response**
```json
{
    "totalOrders": 15,
    "pendingOrders": 5,
    "filledOrders": 8,
    "cancelledOrders": 1,
    "expiredOrders": 1,
    "rejectedOrders": 0
}
```

### **WebSocket Message Format**
```json
{
    "type": "ORDER_UPDATE",
    "data": {
        "orderId": 1,
        "status": "FILLED",
        "filledQuantity": "0.001",
        "averagePrice": "45000.00"
    },
    "timestamp": "2024-01-15T10:30:00"
}
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Authentication Errors**
- Verify JWT token is valid and not expired
- Check Authorization header format: `Bearer {{TOKEN}}`
- Ensure user credentials are correct

#### **Order Placement Errors**
- Check trading pair symbol is correct (e.g., "BTCUSDT")
- Verify order quantity meets minimum requirements
- Ensure sufficient balance for the order
- Check price precision requirements

#### **WebSocket Connection Issues**
- Verify WebSocket URL: `ws://localhost:8080/ws/websocket`
- Check if application is running on port 8080
- Ensure proper STOMP frame format for messages (including blank line after headers)
- Verify authentication with the correct JWT token in CONNECT frame
- Make sure to subscribe to the correct destination topics

#### **Order Modification Errors**
- Verify order ID exists and belongs to the user
- Check if order can be modified (PENDING or PARTIAL_FILLED status)
- Ensure modification values are valid

### **Debug Steps**
1. **Check application logs** for detailed error messages
2. **Verify database connectivity** and table structure
3. **Test with simple orders** before complex scenarios
4. **Use Postman console** to view request/response details
5. **Monitor WebSocket connection** for real-time issues

---

## 📈 **Performance Testing**

### **Load Testing Scenarios**
1. **Multiple Order Placement**: Place 100+ orders rapidly
2. **Concurrent Users**: Test with multiple user sessions
3. **WebSocket Connections**: Test with 50+ concurrent WebSocket connections
4. **Order Book Depth**: Test with deep order books (1000+ levels)

### **Monitoring Points**
- **Response Times**: API response times under load
- **Memory Usage**: Application memory consumption
- **Database Performance**: Query execution times
- **WebSocket Latency**: Real-time update delays

---

## 🎯 **Best Practices**

### **Testing Order**
1. **Start with basic operations** before advanced features
2. **Test error scenarios** alongside success cases
3. **Verify real-time updates** for all operations
4. **Test order modifications** thoroughly
5. **Validate statistics accuracy**

### **WebSocket Testing**
1. **Test connection stability** over time
2. **Verify message ordering** and delivery
3. **Test reconnection scenarios**
4. **Monitor message frequency** and size

### **Data Validation**
1. **Verify order status transitions**
2. **Check balance updates** after trades
3. **Validate fee calculations**
4. **Confirm order book accuracy**

---

This comprehensive guide covers all aspects of the Bitby Spot Trading feature, from basic order placement to advanced order types and real-time WebSocket updates. Use these scenarios to thoroughly test the system and ensure all features work correctly. 