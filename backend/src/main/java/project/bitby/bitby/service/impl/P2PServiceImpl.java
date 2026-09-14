package project.bitby.bitby.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
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
        BigDecimal listedAmount = BigDecimal.valueOf(request.getAmount());
        BigDecimal listedPrice = BigDecimal.valueOf(request.getPricePerUnit());
        BigDecimal userAssetBalance = getUserAssetBalance(seller, request.getAssetSymbol());
        if (userAssetBalance.compareTo(listedAmount) < 0) {
            throw new RuntimeException("Insufficient " + request.getAssetSymbol() + " balance");
        }

        P2PListing listing = new P2PListing();
        listing.setSeller(seller);
        listing.setCryptocurrency(cryptocurrency);
        listing.setAssetSymbol(request.getAssetSymbol());
        listing.setAmount(listedAmount);
        listing.setPricePerUnit(listedPrice);
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

        // PlaceOrderRequest still carries a Double from the wire; compare and
        // move money in BigDecimal from here on.
        BigDecimal requestedAmount = BigDecimal.valueOf(request.getAmount());

        if (requestedAmount.compareTo(listing.getAmount()) > 0) {
            throw new RuntimeException("Requested amount exceeds available amount");
        }

        // Validate that listing has a valid asset symbol
        if (listing.getAssetSymbol() == null || listing.getAssetSymbol().trim().isEmpty()) {
            throw new RuntimeException("Listing has invalid asset symbol. Please contact support.");
        }

        // Check if buyer has enough currency balance
        BigDecimal buyerCurrencyBalance = getUserCurrencyBalance(buyer, listing.getCurrency());
        BigDecimal totalPrice = requestedAmount.multiply(listing.getPricePerUnit());

        if (buyerCurrencyBalance.compareTo(totalPrice) < 0) {
            throw new RuntimeException("Insufficient " + listing.getCurrency() + " balance. Required: "
                    + totalPrice.toPlainString() + ", Available: " + buyerCurrencyBalance.toPlainString());
        }

        // Check if seller has enough asset balance
        BigDecimal sellerAssetBalance = getUserAssetBalance(listing.getSeller(), listing.getAssetSymbol());
        if (sellerAssetBalance.compareTo(requestedAmount) < 0) {
            throw new RuntimeException("Seller has insufficient " + listing.getAssetSymbol() + " balance. Required: "
                    + requestedAmount.toPlainString() + ", Available: " + sellerAssetBalance.toPlainString());
        }

        // Deduct currency from buyer
        updateUserCurrencyBalance(buyer, listing.getCurrency(), totalPrice.negate());

        // Deduct assets from seller
        updateUserAssetBalance(listing.getSeller(), listing.getAssetSymbol(), requestedAmount.negate());

        // Update listing amount
        listing.setAmount(listing.getAmount().subtract(requestedAmount));
        if (listing.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
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
        order.setAmount(requestedAmount);
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
        listing.setAmount(listing.getAmount().add(order.getAmount()));
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

    /*
     * These four wrapped the same per-asset switch that User now owns, and
     * they each recognised a slightly different set of assets. They delegate
     * now, so adding an asset is one change rather than four.
     */
    private BigDecimal getUserAssetBalance(User user, String assetSymbol) {
        BigDecimal balance = user.getBalanceFor(assetSymbol);
        if (balance == null) {
            throw new RuntimeException("Unsupported asset: " + assetSymbol);
        }
        return balance;
    }

    private void updateUserAssetBalance(User user, String assetSymbol, BigDecimal amount) {
        adjustBalance(user, assetSymbol, amount, "asset");
    }

    private BigDecimal getUserCurrencyBalance(User user, String currency) {
        BigDecimal balance = user.getBalanceFor(currency);
        if (balance == null) {
            throw new RuntimeException("Unsupported currency: " + currency);
        }
        return balance;
    }

    private void updateUserCurrencyBalance(User user, String currency, BigDecimal amount) {
        adjustBalance(user, currency, amount, "currency");
    }

    /** Applies a signed delta, refusing to take the balance below zero. */
    private void adjustBalance(User user, String asset, BigDecimal amount, String kind) {
        BigDecimal current = user.getBalanceFor(asset);
        if (current == null) {
            throw new RuntimeException("Unsupported " + kind + ": " + asset);
        }
        BigDecimal updated = current.add(amount);
        if (updated.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Insufficient " + asset + " balance. Cannot deduct "
                    + amount.abs().toPlainString() + " from current balance " + current.toPlainString());
        }
        user.setBalanceFor(asset, updated);
        userRepository.save(user);
    }
} 