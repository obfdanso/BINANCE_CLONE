package project.bitby.bitby.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.bitby.bitby.dto.*;
import project.bitby.bitby.models.Cryptocurrency;
import project.bitby.bitby.models.P2PListing;
import project.bitby.bitby.models.P2POrder;
import project.bitby.bitby.models.User;
import project.bitby.bitby.repository.CryptocurrencyRepository;
import project.bitby.bitby.repository.P2PListingRepository;
import project.bitby.bitby.repository.P2POrderRepository;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.service.P2PService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class P2PServiceImpl implements P2PService {

    @Autowired
    private P2PListingRepository listingRepository;

    @Autowired
    private P2POrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CryptocurrencyRepository cryptocurrencyRepository;

    @Override
    @Transactional
    public ListingResponse createListing(CreateListingRequest request, String userId) {
        User seller = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find cryptocurrency by symbol
        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findBySymbol(request.getAssetSymbol())
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found: " + request.getAssetSymbol()));

        // Check if user has enough assets
        Double userAssetBalance = getUserAssetBalance(seller, request.getAssetSymbol());
        if (userAssetBalance < request.getAmount()) {
            throw new RuntimeException("Insufficient " + request.getAssetSymbol() + " balance");
        }

        P2PListing listing = new P2PListing();
        listing.setSeller(seller);
        listing.setCryptocurrency(cryptocurrency);
        listing.setAssetSymbol(request.getAssetSymbol());
        listing.setAmount(request.getAmount());
        listing.setPricePerUnit(request.getPricePerUnit());
        listing.setCurrency(request.getCurrency());
        listing.setStatus(P2PListing.ListingStatus.ACTIVE);

        P2PListing savedListing = listingRepository.save(listing);

        return convertToListingResponse(savedListing);
    }

    @Override
    public List<ListingResponse> getAllActiveListings(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<P2PListing> listings = listingRepository.findActiveListingsExcludingUser(
                P2PListing.ListingStatus.ACTIVE, user.getId());

        return listings.stream()
                .map(this::convertToListingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponse cancelListing(Long listingId, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        P2PListing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getSeller().getId().equals(user.getId())) {
            throw new RuntimeException("You can only cancel your own listings");
        }

        if (listing.getStatus() != P2PListing.ListingStatus.ACTIVE) {
            throw new RuntimeException("Can only cancel active listings");
        }

        listing.setStatus(P2PListing.ListingStatus.CANCELLED);
        listingRepository.save(listing);

        return new MessageResponse("Listing cancelled successfully");
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request, String userId) {
        User buyer = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        P2PListing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getStatus() != P2PListing.ListingStatus.ACTIVE) {
            throw new RuntimeException("Listing is not active");
        }

        if (listing.getSeller().getId().equals(buyer.getId())) {
            throw new RuntimeException("You cannot buy from yourself");
        }

        if (request.getAmount() > listing.getAmount()) {
            throw new RuntimeException("Requested amount exceeds available amount");
        }

        // Validate that listing has a valid asset symbol
        if (listing.getAssetSymbol() == null || listing.getAssetSymbol().trim().isEmpty()) {
            throw new RuntimeException("Listing has invalid asset symbol. Please contact support.");
        }

        // Check if buyer has enough currency balance
        Double buyerCurrencyBalance = getUserCurrencyBalance(buyer, listing.getCurrency());
        Double totalPrice = request.getAmount() * listing.getPricePerUnit();
        
        if (buyerCurrencyBalance < totalPrice) {
            throw new RuntimeException("Insufficient " + listing.getCurrency() + " balance. Required: " + totalPrice + ", Available: " + buyerCurrencyBalance);
        }

        // Check if seller has enough asset balance
        Double sellerAssetBalance = getUserAssetBalance(listing.getSeller(), listing.getAssetSymbol());
        if (sellerAssetBalance < request.getAmount()) {
            throw new RuntimeException("Seller has insufficient " + listing.getAssetSymbol() + " balance. Required: " + request.getAmount() + ", Available: " + sellerAssetBalance);
        }

        // Deduct currency from buyer
        updateUserCurrencyBalance(buyer, listing.getCurrency(), -totalPrice);

        // Deduct assets from seller
        updateUserAssetBalance(listing.getSeller(), listing.getAssetSymbol(), -request.getAmount());

        // Update listing amount
        listing.setAmount(listing.getAmount() - request.getAmount());
        if (listing.getAmount() <= 0) {
            listing.setStatus(P2PListing.ListingStatus.COMPLETED);
        }
        listingRepository.save(listing);

        // Create order
        P2POrder order = new P2POrder();
        order.setListing(listing);
        order.setBuyer(buyer);
        order.setSeller(listing.getSeller());
        order.setUserId(buyer.getUserId());
        order.setCryptocurrency(listing.getCryptocurrency());
        order.setAssetSymbol(listing.getAssetSymbol());
        order.setAmount(request.getAmount());
        order.setTotalPrice(totalPrice);
        order.setPricePerUnit(listing.getPricePerUnit());
        order.setCurrency(listing.getCurrency());
        order.setPaymentMethod("BANK_TRANSFER"); // Default payment method for P2P orders
        order.setOrderType(P2POrder.OrderType.BUY);
        order.setStatus(P2POrder.OrderStatus.PENDING);

        P2POrder savedOrder = orderRepository.save(order);

        return convertToOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public MessageResponse confirmPayment(Long orderId, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        P2POrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyer().getId().equals(user.getId())) {
            throw new RuntimeException("Only the buyer can confirm payment");
        }

        if (order.getStatus() != P2POrder.OrderStatus.PENDING) {
            throw new RuntimeException("Order is not in pending status");
        }

        order.setStatus(P2POrder.OrderStatus.PAID);
        order.setPaymentConfirmedAt(LocalDateTime.now());
        orderRepository.save(order);

        return new MessageResponse("Payment confirmed successfully");
    }

    @Override
    @Transactional
    public MessageResponse releaseAssets(Long orderId, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        P2POrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getSeller().getId().equals(user.getId())) {
            throw new RuntimeException("Only the seller can release assets");
        }

        if (order.getStatus() != P2POrder.OrderStatus.PAID) {
            throw new RuntimeException("Payment must be confirmed before releasing assets");
        }

        // Add assets to buyer
        updateUserAssetBalance(order.getBuyer(), order.getListing().getAssetSymbol(), order.getAmount());

        // Add currency to seller
        updateUserCurrencyBalance(order.getSeller(), order.getCurrency(), order.getTotalPrice());

        order.setStatus(P2POrder.OrderStatus.RELEASED);
        order.setAssetsReleasedAt(LocalDateTime.now());
        orderRepository.save(order);

        return new MessageResponse("Assets released successfully");
    }

    @Override
    @Transactional
    public MessageResponse cancelOrder(Long orderId, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        P2POrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyer().getId().equals(user.getId()) && !order.getSeller().getId().equals(user.getId())) {
            throw new RuntimeException("You can only cancel your own orders");
        }

        if (order.getStatus() == P2POrder.OrderStatus.RELEASED) {
            throw new RuntimeException("Cannot cancel completed orders");
        }

        if (order.getStatus() == P2POrder.OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        // Refund buyer's currency if payment was confirmed
        if (order.getStatus() == P2POrder.OrderStatus.PAID) {
            updateUserCurrencyBalance(order.getBuyer(), order.getCurrency(), order.getTotalPrice());
        } else {
            // If still pending, refund buyer's currency
            updateUserCurrencyBalance(order.getBuyer(), order.getCurrency(), order.getTotalPrice());
        }

        // Return assets to seller
        updateUserAssetBalance(order.getSeller(), order.getListing().getAssetSymbol(), order.getAmount());

        // Update listing amount
        P2PListing listing = order.getListing();
        listing.setAmount(listing.getAmount() + order.getAmount());
        if (listing.getStatus() == P2PListing.ListingStatus.COMPLETED) {
            listing.setStatus(P2PListing.ListingStatus.ACTIVE);
        }
        listingRepository.save(listing);

        order.setStatus(P2POrder.OrderStatus.CANCELLED);
        orderRepository.save(order);

        return new MessageResponse("Order cancelled successfully");
    }

    @Override
    public List<OrderResponse> getBuyerOrders(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<P2POrder> orders = orderRepository.findByBuyer(user);

        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getSellerOrders(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<P2POrder> orders = orderRepository.findBySeller(user);

        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    private ListingResponse convertToListingResponse(P2PListing listing) {
        return new ListingResponse(
                listing.getId(),
                listing.getSeller().getUsername(),
                listing.getAssetSymbol(),
                listing.getAmount(),
                listing.getPricePerUnit(),
                listing.getCurrency(),
                listing.getStatus(),
                listing.getCreatedAt(),
                listing.getUpdatedAt()
        );
    }

    private OrderResponse convertToOrderResponse(P2POrder order) {
        return new OrderResponse(
                order.getId(),
                order.getListing().getId(),
                order.getUserId(),
                order.getBuyer().getUsername(),
                order.getSeller().getUsername(),
                order.getListing().getAssetSymbol(),
                order.getAmount(),
                order.getTotalPrice(),
                order.getPricePerUnit(),
                order.getCurrency(),
                order.getPaymentMethod(),
                order.getOrderType(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getPaymentConfirmedAt(),
                order.getAssetsReleasedAt()
        );
    }

    private Double getUserAssetBalance(User user, String assetSymbol) {
        switch (assetSymbol.toUpperCase()) {
            case "BTC": return user.getBtcBalance() != null ? user.getBtcBalance() : 0.0;
            case "ETH": return user.getEthBalance() != null ? user.getEthBalance() : 0.0;
            case "USDT": return user.getUsdtBalance() != null ? user.getUsdtBalance() : 0.0;
            case "USD": return user.getUsdBalance() != null ? user.getUsdBalance() : 0.0;
            case "BNB": return user.getBnbBalance() != null ? user.getBnbBalance() : 0.0;
            default: throw new RuntimeException("Unsupported asset: " + assetSymbol);
        }
    }

    private void updateUserAssetBalance(User user, String assetSymbol, Double amount) {
        Double currentBalance = getUserAssetBalance(user, assetSymbol);
        Double newBalance = currentBalance + amount;
        
        // Prevent negative balance
        if (newBalance < 0) {
            throw new RuntimeException("Insufficient " + assetSymbol + " balance. Cannot deduct " + amount + " from current balance " + currentBalance);
        }
        
        switch (assetSymbol.toUpperCase()) {
            case "BTC":
                user.setBtcBalance(newBalance);
                break;
            case "ETH":
                user.setEthBalance(newBalance);
                break;
            case "USDT":
                user.setUsdtBalance(newBalance);
                break;
            case "USD":
                user.setUsdBalance(newBalance);
                break;
            case "BNB":
                user.setBnbBalance(newBalance);
                break;
            default:
                throw new RuntimeException("Unsupported asset: " + assetSymbol);
        }
        userRepository.save(user);
    }

    private Double getUserCurrencyBalance(User user, String currency) {
        switch (currency.toUpperCase()) {
            case "GHS": return user.getCediBalance() != null ? user.getCediBalance() : 0.0;
            case "USD": return user.getUsdBalance() != null ? user.getUsdBalance() : 0.0;
            default: throw new RuntimeException("Unsupported currency: " + currency);
        }
    }

    private void updateUserCurrencyBalance(User user, String currency, Double amount) {
        Double currentBalance = getUserCurrencyBalance(user, currency);
        Double newBalance = currentBalance + amount;
        
        // Prevent negative balance
        if (newBalance < 0) {
            throw new RuntimeException("Insufficient " + currency + " balance. Cannot deduct " + amount + " from current balance " + currentBalance);
        }
        
        switch (currency.toUpperCase()) {
            case "GHS":
                user.setCediBalance(newBalance);
                break;
            case "USD":
                user.setUsdBalance(newBalance);
                break;
            default:
                throw new RuntimeException("Unsupported currency: " + currency);
        }
        userRepository.save(user);
    }
} 