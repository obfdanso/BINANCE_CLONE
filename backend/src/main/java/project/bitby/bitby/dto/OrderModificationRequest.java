package project.bitby.bitby.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderModificationRequest {
    
    private Long orderId; // ID of the order to modify
    
    // New values (only provide the fields you want to modify)
    private BigDecimal newPrice; // New limit price
    private BigDecimal newQuantity; // New quantity
    private BigDecimal newStopPrice; // New stop price
    private LocalDateTime newExpirationTime; // New expiration time
    
    // Modification reason (for audit trail)
    private String reason;
    
    // Validation method
    public boolean isValid() {
        if (orderId == null) return false;
        
        // At least one field should be provided for modification
        return newPrice != null || newQuantity != null || 
               newStopPrice != null || newExpirationTime != null;
    }
    
    // Check if price modification is requested
    public boolean isPriceModification() {
        return newPrice != null;
    }
    
    // Check if quantity modification is requested
    public boolean isQuantityModification() {
        return newQuantity != null;
    }
    
    // Check if stop price modification is requested
    public boolean isStopPriceModification() {
        return newStopPrice != null;
    }
    
    // Check if expiration time modification is requested
    public boolean isExpirationModification() {
        return newExpirationTime != null;
    }
} 