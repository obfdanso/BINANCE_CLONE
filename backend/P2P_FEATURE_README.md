# P2P Trading Feature

This document describes the Peer-to-Peer (P2P) trading feature implemented in the Bitby application.

## Overview

The P2P trading feature allows users to buy and sell digital assets directly from each other without going through a centralized exchange. This provides users with more control over their trades and potentially better pricing.

## Features

### Core Functionality

1. **Create Listings**: Users can create listings to sell their assets
2. **Browse Listings**: Users can view all active listings from other users
3. **Place Orders**: Users can place orders to buy assets from listings
4. **Payment Confirmation**: Buyers can confirm payment after placing orders
5. **Asset Release**: Sellers can release assets after payment confirmation
6. **Order Management**: Users can view and manage their orders
7. **Cancellation**: Both listings and orders can be cancelled

### Security Features

- JWT-based authentication for all endpoints
- User authorization checks (users can only manage their own listings/orders)
- Balance validation before transactions
- Transaction status tracking

## Architecture

### Models

#### P2PListing
- Represents a listing created by a seller
- Contains asset details, pricing, and status
- Links to the seller (User entity)

#### P2POrder
- Represents an order placed by a buyer
- Contains transaction details and status
- Links to both buyer and seller (User entities)
- Links to the original listing

### Database Schema

```sql
-- P2P Listings table
CREATE TABLE p2p_listings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    seller_id BIGINT NOT NULL,
    asset_symbol VARCHAR(10) NOT NULL,
    amount DOUBLE NOT NULL,
    price_per_unit DOUBLE NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- P2P Orders table
CREATE TABLE p2p_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    listing_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    total_price DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    payment_confirmed_at TIMESTAMP,
    assets_released_at TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES p2p_listings(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

## API Endpoints

### Base URL
```
http://localhost:8080/api/p2p
```

### Authentication
All endpoints require JWT authentication:
```
Authorization: Bearer <jwt-token>
```

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-listing` | Create a new P2P listing |
| GET | `/listings` | Get all active listings |
| POST | `/listings/{id}/cancel` | Cancel a listing |
| POST | `/orders` | Place an order |
| POST | `/orders/{id}/confirm-payment` | Confirm payment |
| POST | `/orders/{id}/release` | Release assets |
| POST | `/orders/{id}/cancel` | Cancel an order |
| GET | `/orders/buyer` | Get buyer orders |
| GET | `/orders/seller` | Get seller orders |

## Business Logic

### Transaction Flow

1. **Listing Creation**
   - Seller creates a listing with asset details and pricing
   - System validates seller has sufficient assets
   - Assets are temporarily held (deducted from seller's balance)

2. **Order Placement**
   - Buyer places an order for a specific amount
   - System validates buyer has sufficient currency
   - Currency is deducted from buyer's balance
   - Assets are deducted from seller's balance
   - Listing amount is reduced

3. **Payment Confirmation**
   - Buyer confirms payment has been made
   - Order status changes to PAYMENT_CONFIRMED

4. **Asset Release**
   - Seller releases assets to buyer
   - Assets are transferred to buyer's balance
   - Currency is transferred to seller's balance
   - Order status changes to COMPLETED

### Balance Management

The system automatically manages user balances:

- **Asset Balances**: BTC, ETH, USDT, USD, BNB
- **Currency Balances**: GHS, USD

When transactions occur:
- Assets are deducted from seller and added to buyer
- Currency is deducted from buyer and added to seller

### Error Handling

The system includes comprehensive error handling:

- **Insufficient Balance**: Validates user has enough assets/currency
- **Unauthorized Actions**: Ensures users can only manage their own listings/orders
- **Invalid Status**: Prevents actions on orders/listings in wrong status
- **Self-Trading**: Prevents users from buying from themselves

## Order Status Flow

```
PENDING → PAYMENT_CONFIRMED → ASSETS_RELEASED → COMPLETED
    ↓
CANCELLED
```

### Status Descriptions

- **PENDING**: Order created, waiting for payment confirmation
- **PAYMENT_CONFIRMED**: Buyer confirmed payment
- **ASSETS_RELEASED**: Seller released assets
- **COMPLETED**: Transaction completed successfully
- **CANCELLED**: Order cancelled (can happen at any stage)

## Listing Status

- **ACTIVE**: Listing is available for trading
- **CANCELLED**: Listing has been cancelled by seller
- **COMPLETED**: All assets in listing have been sold

## Supported Assets and Currencies

### Assets
- BTC (Bitcoin)
- ETH (Ethereum)
- USDT (Tether)
- USD (US Dollar)
- BNB (Binance Coin)

### Currencies
- GHS (Ghanaian Cedi)
- USD (US Dollar)

## Testing

### Prerequisites
1. Application running on `http://localhost:8080`
2. Valid JWT token
3. At least two user accounts with sufficient balances

### Test Scenarios

1. **Complete Transaction Flow**
   - Create listing → Place order → Confirm payment → Release assets

2. **Order Cancellation**
   - Place order → Cancel order → Verify refunds

3. **Listing Cancellation**
   - Create listing → Cancel listing → Verify status

### Testing Tools

- **Postman**: Use the provided Postman guide
- **Batch Script**: Use `test_p2p_endpoints.bat` for automated testing
- **Manual Testing**: Test each endpoint individually

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users can only manage their own listings/orders
3. **Balance Validation**: Prevents overselling/overbuying
4. **Transaction Isolation**: Uses database transactions for data consistency
5. **Input Validation**: Validates all input parameters

## Future Enhancements

1. **Escrow System**: Implement escrow for additional security
2. **Dispute Resolution**: Add dispute handling mechanisms
3. **Rating System**: Allow users to rate each other
4. **Chat System**: Enable communication between buyers and sellers
5. **Advanced Filtering**: Add filters for price, location, payment methods
6. **Mobile Notifications**: Send notifications for order updates

## Troubleshooting

### Common Issues

1. **Insufficient Balance Error**
   - Ensure user has enough assets/currency before creating listings/orders

2. **Unauthorized Error**
   - Verify JWT token is valid and not expired
   - Ensure user is trying to manage their own listings/orders

3. **Invalid Status Error**
   - Check current order/listing status before performing actions

4. **Database Connection Issues**
   - Verify database is running and accessible
   - Check application.properties configuration

### Debugging

1. Check application logs for detailed error messages
2. Verify database tables exist and have correct schema
3. Test individual endpoints with Postman
4. Verify JWT token contains correct user information

## Dependencies

- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- MySQL/PostgreSQL
- Lombok
- JWT (JSON Web Tokens)

## Configuration

Ensure the following properties are configured in `application.properties`:

```properties
# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/bitby
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT configuration
bitby.app.jwtSecret=your_jwt_secret
bitby.app.jwtExpirationMs=86400000
``` 