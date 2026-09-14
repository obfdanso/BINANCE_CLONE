package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistResponse {
    private String symbol;
    private String name;
    private String currentPrice;
    private String priceChangePercentage24h;
    private String imageUrl;
    private LocalDateTime addedAt;
} 