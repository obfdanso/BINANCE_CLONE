#!/bin/bash

# Market Data API Test Script
# Make sure your Spring Boot application is running on localhost:8080

BASE_URL="http://localhost:8080/api/v1/market"

echo "=== Bitby Market Data API Test Script ==="
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Get all market data
echo "1. Testing GET /api/v1/market/all"
curl -X GET "$BASE_URL/all" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test 2: Get specific cryptocurrency
echo "2. Testing GET /api/v1/market/crypto/BTC"
curl -X GET "$BASE_URL/crypto/BTC" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test 3: Get top 5 by market cap
echo "3. Testing GET /api/v1/market/top/market-cap?limit=5"
curl -X GET "$BASE_URL/top/market-cap?limit=5" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test 4: Get top 3 gainers
echo "4. Testing GET /api/v1/market/top/gainers?limit=3"
curl -X GET "$BASE_URL/top/gainers?limit=3" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test 5: Get top 3 losers
echo "5. Testing GET /api/v1/market/top/losers?limit=3"
curl -X GET "$BASE_URL/top/losers?limit=3" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test 6: Search for Bitcoin
echo "6. Testing GET /api/v1/market/search?query=bitcoin"
curl -X GET "$BASE_URL/search?query=bitcoin" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test 7: Get price history for BTC
echo "7. Testing GET /api/v1/market/crypto/BTC/history?days=7"
curl -X GET "$BASE_URL/crypto/BTC/history?days=7" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""

# Test 8: Manual refresh (optional - uncomment if needed)
# echo "8. Testing POST /api/v1/market/refresh"
# curl -X POST "$BASE_URL/refresh" \
#   -H "Content-Type: application/json" \
#   -w "\nHTTP Status: %{http_code}\n" \
#   -s
# echo ""

echo "=== Test completed ==="
echo "Check the responses above for successful API calls."
echo "HTTP Status 200 indicates success." 