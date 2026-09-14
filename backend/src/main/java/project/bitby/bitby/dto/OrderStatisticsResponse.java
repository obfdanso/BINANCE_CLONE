package project.bitby.bitby.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticsResponse {
    private long totalOrders;
    private long pendingOrders;
    private long filledOrders;
    private long cancelledOrders;
    private long expiredOrders;
    private long rejectedOrders;
} 