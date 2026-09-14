package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderBookResponse {
    private String symbol;
    private Long lastUpdateId;
    private List<OrderBookLevel> bids;
    private List<OrderBookLevel> asks;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderBookLevel {
        private BigDecimal price;
        private BigDecimal quantity;
        private Integer orderCount;
    }
} 