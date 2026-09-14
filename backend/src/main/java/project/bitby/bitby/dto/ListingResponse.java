package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.bitby.bitby.models.P2PListing;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {
    private Long id;
    private String sellerUsername;
    private String assetSymbol;
    private Double amount;
    private Double pricePerUnit;
    private String currency;
    private P2PListing.ListingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 