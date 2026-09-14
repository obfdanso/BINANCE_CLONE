package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateListingRequest {
    private String assetSymbol;
    private Double amount;
    private Double pricePerUnit;
    private String currency;
} 