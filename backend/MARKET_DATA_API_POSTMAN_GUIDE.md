# Market Data API - Postman Testing Guide

## Base URL
```
http://localhost:8080/api/v1/market
```

## Authentication
For protected endpoints, include the following header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints Overview

### 1. Get All Market Data
**GET** `/api/v1/market/all`

Returns market data for all active cryptocurrencies ordered by market cap.

**Headers:**
```
Content-Type: application/json
```

**Response Example:**
```json
[
  {
    "symbol": "BTC",
    "name": "Bitcoin",
    "currentPrice": 43250.50,
    "priceChange24h": 1250.75,
    "priceChangePercentage24h": 2.98,
    "marketCap": 850000000000,
    "volume24h": 25000000000,
    "high24h": 44500.00,
    "low24h": 42000.00,
    "imageUrl": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "lastUpdated": "2024-01-15T10:30:00"
  },
  {
    "symbol": "ETH",
    "name": "Ethereum",
    "currentPrice": 2650.25,
    "priceChange24h": -45.50,
    "priceChangePercentage24h": -1.69,
    "marketCap": 320000000000,
    "volume24h": 15000000000,
    "high24h": 2750.00,
    "low24h": 2600.00,
    "imageUrl": "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    "lastUpdated": "2024-01-15T10:30:00"
  }
]
```

---

### 2. Get Cryptocurrency by Symbol
**GET** `/api/v1/market/crypto/{symbol}`

Returns market data for a specific cryptocurrency.

**Path Parameters:**
- `symbol` (string, required): Cryptocurrency symbol (e.g., BTC, ETH, ADA)

**Example Request:**
```
GET http://localhost:8080/api/v1/market/crypto/BTC
```

**Response Example:**
```json
{
  "symbol": "BTC",
  "name": "Bitcoin",
  "currentPrice": 43250.50,
  "priceChange24h": 1250.75,
  "priceChangePercentage24h": 2.98,
  "marketCap": 850000000000,
  "volume24h": 25000000000,
  "high24h": 44500.00,
  "low24h": 42000.00,
  "imageUrl": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  "lastUpdated": "2024-01-15T10:30:00"
}
```

**Error Response (404):**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Cryptocurrency not found"
}
```

---

### 3. Get Top Cryptocurrencies by Market Cap
**GET** `/api/v1/market/top/market-cap`

Returns top cryptocurrencies sorted by market capitalization.

**Query Parameters:**
- `limit` (integer, optional): Number of results to return (default: 10, max: 100)

**Example Requests:**
```
GET http://localhost:8080/api/v1/market/top/market-cap
GET http://localhost:8080/api/v1/market/top/market-cap?limit=20
```

**Response Example:**
```json
[
  {
    "symbol": "BTC",
    "name": "Bitcoin",
    "currentPrice": 43250.50,
    "priceChange24h": 1250.75,
    "priceChangePercentage24h": 2.98,
    "marketCap": 850000000000,
    "volume24h": 25000000000,
    "high24h": 44500.00,
    "low24h": 42000.00,
    "imageUrl": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "lastUpdated": "2024-01-15T10:30:00"
  }
]
```

---

### 4. Get Top Gainers
**GET** `/api/v1/market/top/gainers`

Returns cryptocurrencies with highest 24h price gains.

**Query Parameters:**
- `limit` (integer, optional): Number of results to return (default: 10)

**Example Request:**
```
GET http://localhost:8080/api/v1/market/top/gainers?limit=5
```

**Response Example:**
```json
[
  {
    "symbol": "SOL",
    "name": "Solana",
    "currentPrice": 98.50,
    "priceChange24h": 12.75,
    "priceChangePercentage24h": 14.87,
    "marketCap": 45000000000,
    "volume24h": 3500000000,
    "high24h": 100.00,
    "low24h": 85.00,
    "imageUrl": "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    "lastUpdated": "2024-01-15T10:30:00"
  }
]
```

---

### 5. Get Top Losers
**GET** `/api/v1/market/top/losers`

Returns cryptocurrencies with highest 24h price losses.

**Query Parameters:**
- `limit` (integer, optional): Number of results to return (default: 10)

**Example Request:**
```
GET http://localhost:8080/api/v1/market/top/losers?limit=5
```

**Response Example:**
```json
[
  {
    "symbol": "DOGE",
    "name": "Dogecoin",
    "currentPrice": 0.085,
    "priceChange24h": -0.015,
    "priceChangePercentage24h": -15.00,
    "marketCap": 12000000000,
    "volume24h": 800000000,
    "high24h": 0.100,
    "low24h": 0.080,
    "imageUrl": "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    "lastUpdated": "2024-01-15T10:30:00"
  }
]
```

---

### 6. Get Price History
**GET** `/api/v1/market/crypto/{symbol}/history`

Returns historical price data for a cryptocurrency.

**Path Parameters:**
- `symbol` (string, required): Cryptocurrency symbol

**Query Parameters:**
- `days` (integer, optional): Number of days to retrieve (default: 7)

**Example Requests:**
```
GET http://localhost:8080/api/v1/market/crypto/BTC/history
GET http://localhost:8080/api/v1/market/crypto/BTC/history?days=30
```

**Response Example:**
```json
[
  {
    "symbol": "BTC",
    "price": 43250.50,
    "volume": 25000000000,
    "timestamp": "2024-01-15T10:30:00",
    "interval": "HOURLY"
  },
  {
    "symbol": "BTC",
    "price": 43100.25,
    "volume": 24000000000,
    "timestamp": "2024-01-15T09:30:00",
    "interval": "HOURLY"
  }
]
```

---

### 7. Search Cryptocurrencies
**GET** `/api/v1/market/search`

Search cryptocurrencies by name or symbol.

**Query Parameters:**
- `query` (string, required): Search query

**Example Requests:**
```
GET http://localhost:8080/api/v1/market/search?query=bitcoin
GET http://localhost:8080/api/v1/market/search?query=btc
GET http://localhost:8080/api/v1/market/search?query=eth
```

**Response Example:**
```json
[
  {
    "symbol": "BTC",
    "name": "Bitcoin",
    "currentPrice": 43250.50,
    "priceChange24h": 1250.75,
    "priceChangePercentage24h": 2.98,
    "marketCap": 850000000000,
    "volume24h": 25000000000,
    "high24h": 44500.00,
    "low24h": 42000.00,
    "imageUrl": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "lastUpdated": "2024-01-15T10:30:00"
  }
]
```

---

### 8. Refresh Market Data
**POST** `/api/v1/market/refresh`

Manually trigger a refresh of market data from external APIs.

**Headers:**
```
Content-Type: application/json
```

**Example Request:**
```
POST http://localhost:8080/api/v1/market/refresh
```

**Response Example:**
```json
"Market data refresh initiated"
```

---

## Postman Collection Setup

### 1. Create Environment Variables
Create a new environment in Postman with these variables:
- `base_url`: `http://localhost:8080`
- `jwt_token`: (leave empty, will be set after login)

### 2. Collection Structure
Create a collection called "Bitby Market Data API" with the following folders:

#### Market Data
- Get All Market Data
- Get Cryptocurrency by Symbol
- Get Top by Market Cap
- Get Top Gainers
- Get Top Losers
- Get Price History
- Search Cryptocurrencies
- Refresh Market Data

### 3. Example Postman Request Setup

#### Get All Market Data
```
Method: GET
URL: {{base_url}}/api/v1/market/all
Headers: 
  Content-Type: application/json
```

#### Get Cryptocurrency by Symbol
```
Method: GET
URL: {{base_url}}/api/v1/market/crypto/BTC
Headers:
  Content-Type: application/json
```

#### Get Top by Market Cap with Limit
```
Method: GET
URL: {{base_url}}/api/v1/market/top/market-cap?limit=20
Headers:
  Content-Type: application/json
```

#### Search Cryptocurrencies
```
Method: GET
URL: {{base_url}}/api/v1/market/search?query=bitcoin
Headers:
  Content-Type: application/json
```

#### Refresh Market Data
```
Method: POST
URL: {{base_url}}/api/v1/market/refresh
Headers:
  Content-Type: application/json
```

## Testing Scenarios

### 1. Basic Functionality Test
1. Start your Spring Boot application
2. Call `GET /api/v1/market/all` to verify the service is running
3. Check if you receive market data for cryptocurrencies

### 2. Individual Cryptocurrency Test
1. Call `GET /api/v1/market/crypto/BTC` to get Bitcoin data
2. Call `GET /api/v1/market/crypto/ETH` to get Ethereum data
3. Test with invalid symbol: `GET /api/v1/market/crypto/INVALID` (should return 404)

### 3. Top Lists Test
1. Call `GET /api/v1/market/top/market-cap?limit=5` for top 5 by market cap
2. Call `GET /api/v1/market/top/gainers?limit=3` for top 3 gainers
3. Call `GET /api/v1/market/top/losers?limit=3` for top 3 losers

### 4. Search Functionality Test
1. Call `GET /api/v1/market/search?query=bitcoin` (should find Bitcoin)
2. Call `GET /api/v1/market/search?query=btc` (should find Bitcoin)
3. Call `GET /api/v1/market/search?query=xyz` (should return empty array)

### 5. Price History Test
1. Call `GET /api/v1/market/crypto/BTC/history` for 7-day history
2. Call `GET /api/v1/market/crypto/BTC/history?days=30` for 30-day history

### 6. Manual Refresh Test
1. Call `POST /api/v1/market/refresh` to manually trigger data update
2. Wait a few seconds
3. Call `GET /api/v1/market/all` to see updated data

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK`: Successful request
- `404 Not Found`: Cryptocurrency not found
- `500 Internal Server Error`: Server error

## Rate Limiting

The CoinGecko API has rate limits. The application fetches data every 5 minutes automatically. Manual refresh should be used sparingly.

## Notes

1. The application automatically fetches market data every 5 minutes
2. Data is stored in PostgreSQL database
3. WebSocket broadcasts are sent when data is updated
4. All prices are in USD
5. Market cap and volume are in USD
6. Price changes are for the last 24 hours 