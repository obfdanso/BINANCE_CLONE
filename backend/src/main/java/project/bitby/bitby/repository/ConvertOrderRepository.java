package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.ConvertOrder;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConvertOrderRepository extends JpaRepository<ConvertOrder, Long> {

    // Find all orders for a specific user by userId
    List<ConvertOrder> findByUserUserIdOrderByCreatedAtDesc(String userId);

    // Find orders by user and status
    List<ConvertOrder> findByUserUserIdAndStatusOrderByCreatedAtDesc(String userId, ConvertOrder.ConvertStatus status);

    // Find orders by status
    List<ConvertOrder> findByStatus(ConvertOrder.ConvertStatus status);

    // Find pending limit orders for a specific cryptocurrency pair
    @Query("SELECT co FROM ConvertOrder co WHERE co.status = 'PENDING' AND co.convertType = 'LIMIT' " +
           "AND co.fromCrypto.symbol = :fromSymbol AND co.toCrypto.symbol = :toSymbol " +
           "AND co.targetPrice <= :currentPrice")
    List<ConvertOrder> findExecutableLimitOrders(@Param("fromSymbol") String fromSymbol, 
                                                @Param("toSymbol") String toSymbol, 
                                                @Param("currentPrice") java.math.BigDecimal currentPrice);

    // Find recurring orders that need to be executed
    @Query("SELECT co FROM ConvertOrder co WHERE co.status = 'PENDING' AND co.convertType = 'RECURRING' " +
           "AND co.nextExecutionTime <= :currentTime " +
           "AND (co.maxExecutions IS NULL OR co.totalExecutions < co.maxExecutions)")
    List<ConvertOrder> findExecutableRecurringOrders(@Param("currentTime") LocalDateTime currentTime);

    // Find orders that have expired
    @Query("SELECT co FROM ConvertOrder co WHERE co.status = 'PENDING' AND co.expiresAt <= :currentTime")
    List<ConvertOrder> findExpiredOrders(@Param("currentTime") LocalDateTime currentTime);

    // Find orders by convert type
    List<ConvertOrder> findByUserUserIdAndConvertTypeOrderByCreatedAtDesc(String userId, ConvertOrder.ConvertType convertType);

    // Count active orders for a user
    @Query("SELECT COUNT(co) FROM ConvertOrder co WHERE co.user.userId = :userId AND co.status = 'PENDING'")
    Long countActiveOrdersByUserId(@Param("userId") String userId);
} 