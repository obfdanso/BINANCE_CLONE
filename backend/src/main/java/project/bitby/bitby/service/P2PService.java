package project.bitby.bitby.service;

import project.bitby.bitby.dto.*;
import project.bitby.bitby.models.P2POrder;

import java.util.List;

public interface P2PService {
    
    ListingResponse createListing(CreateListingRequest request, String userId);
    
    List<ListingResponse> getAllActiveListings(String userId);
    
    MessageResponse cancelListing(Long listingId, String userId);
    
    OrderResponse placeOrder(PlaceOrderRequest request, String userId);
    
    MessageResponse confirmPayment(Long orderId, String userId);
    
    MessageResponse releaseAssets(Long orderId, String userId);
    
    MessageResponse cancelOrder(Long orderId, String userId);
    
    List<OrderResponse> getBuyerOrders(String userId);
    
    List<OrderResponse> getSellerOrders(String userId);
} 