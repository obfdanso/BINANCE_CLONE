package project.bitby.bitby.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.*;
import project.bitby.bitby.models.P2PListing;
import project.bitby.bitby.models.User;
import project.bitby.bitby.repository.P2PListingRepository;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.security.UserDetailsImpl;
import project.bitby.bitby.service.P2PService;

import java.util.List;

@RestController
@RequestMapping("/api/p2p")
public class P2PController {

    @Autowired
    private P2PService p2pService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private P2PListingRepository listingRepository;

    @PostMapping("/create-listing")
    public ResponseEntity<ListingResponse> createListing(
            @RequestBody CreateListingRequest request,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        ListingResponse response = p2pService.createListing(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/listings")
    public ResponseEntity<List<ListingResponse>> getAllActiveListings(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<ListingResponse> response = p2pService.getAllActiveListings(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/listings/{listingId}/cancel")
    public ResponseEntity<MessageResponse> cancelListing(
            @PathVariable Long listingId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        MessageResponse response = p2pService.cancelListing(listingId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestBody PlaceOrderRequest request,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        OrderResponse response = p2pService.placeOrder(request, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders/{orderId}/confirm-payment")
    public ResponseEntity<MessageResponse> confirmPayment(
            @PathVariable Long orderId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        MessageResponse response = p2pService.confirmPayment(orderId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders/{orderId}/release")
    public ResponseEntity<MessageResponse> releaseAssets(
            @PathVariable Long orderId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        MessageResponse response = p2pService.releaseAssets(orderId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders/{orderId}/cancel")
    public ResponseEntity<MessageResponse> cancelOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        MessageResponse response = p2pService.cancelOrder(orderId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/buyer")
    public ResponseEntity<List<OrderResponse>> getBuyerOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<OrderResponse> response = p2pService.getBuyerOrders(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/seller")
    public ResponseEntity<List<OrderResponse>> getSellerOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<OrderResponse> response = p2pService.getSellerOrders(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Debug endpoint to check order placement validation
     */
    @PostMapping("/debug-order")
    public ResponseEntity<?> debugOrderPlacement(
            @RequestBody PlaceOrderRequest request,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String userId = userDetails.getId();
            
            // Check if user exists
            var userOpt = userRepository.findByUserId(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found with ID: " + userId);
            }
            User buyer = userOpt.get();
            
            // Check if listing exists
            var listingOpt = listingRepository.findById(request.getListingId());
            if (listingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Listing not found with ID: " + request.getListingId());
            }
            P2PListing listing = listingOpt.get();
            
            // Check listing status
            if (listing.getStatus() != P2PListing.ListingStatus.ACTIVE) {
                return ResponseEntity.badRequest().body("Listing is not active. Status: " + listing.getStatus());
            }
            
            // Check if buyer is trying to buy from themselves
            if (listing.getSeller().getId().equals(buyer.getId())) {
                return ResponseEntity.badRequest().body("You cannot buy from yourself");
            }
            
            // Check amount validation
            if (request.getAmount() > listing.getAmount()) {
                return ResponseEntity.badRequest().body("Requested amount (" + request.getAmount() + 
                    ") exceeds available amount (" + listing.getAmount() + ")");
            }
            
            // Check currency balance
            Double buyerCurrencyBalance = getUserCurrencyBalance(buyer, listing.getCurrency());
            Double totalPrice = request.getAmount() * listing.getPricePerUnit();
            
            if (buyerCurrencyBalance < totalPrice) {
                return ResponseEntity.badRequest().body("Insufficient " + listing.getCurrency() + 
                    " balance. Required: " + totalPrice + ", Available: " + buyerCurrencyBalance);
            }
            
            // Check seller asset balance
            Double sellerAssetBalance = getUserAssetBalance(listing.getSeller(), listing.getAssetSymbol());
            if (sellerAssetBalance < request.getAmount()) {
                return ResponseEntity.badRequest().body("Seller has insufficient " + listing.getAssetSymbol() + 
                    " balance. Required: " + request.getAmount() + ", Available: " + sellerAssetBalance);
            }
            
            return ResponseEntity.ok("All validations passed. Order can be placed successfully.");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during validation: " + e.getMessage());
        }
    }

    private Double getUserCurrencyBalance(User user, String currency) {
        switch (currency.toUpperCase()) {
            case "GHS": return user.getCediBalance() != null ? user.getCediBalance() : 0.0;
            case "USD": return user.getUsdBalance() != null ? user.getUsdBalance() : 0.0;
            default: throw new RuntimeException("Unsupported currency: " + currency);
        }
    }

    private Double getUserAssetBalance(User user, String assetSymbol) {
        switch (assetSymbol.toUpperCase()) {
            case "BTC": return user.getBtcBalance() != null ? user.getBtcBalance() : 0.0;
            case "ETH": return user.getEthBalance() != null ? user.getEthBalance() : 0.0;
            default: throw new RuntimeException("Unsupported asset: " + assetSymbol);
        }
    }
} 