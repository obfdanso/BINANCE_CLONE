package project.bitby.bitby.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkOrderRequest {
    
    private List<AdvancedOrderRequest> orders; // List of orders to place
    
    private String strategy; // Optional strategy name (e.g., "GRID", "DCA", "ARBITRAGE")
    
    private String clientBatchId; // Client-generated batch ID for tracking
    
    // Validation method
    public boolean isValid() {
        if (orders == null || orders.isEmpty()) return false;
        
        // Validate each order in the batch
        for (AdvancedOrderRequest order : orders) {
            if (!order.isValid()) {
                return false;
            }
        }
        
        return true;
    }
    
    // Get number of orders in the batch
    public int getOrderCount() {
        return orders != null ? orders.size() : 0;
    }
    
    // Check if this is a grid trading strategy
    public boolean isGridStrategy() {
        return "GRID".equalsIgnoreCase(strategy);
    }
    
    // Check if this is a DCA (Dollar Cost Averaging) strategy
    public boolean isDCAStrategy() {
        return "DCA".equalsIgnoreCase(strategy);
    }
    
    // Check if this is an arbitrage strategy
    public boolean isArbitrageStrategy() {
        return "ARBITRAGE".equalsIgnoreCase(strategy);
    }
} 