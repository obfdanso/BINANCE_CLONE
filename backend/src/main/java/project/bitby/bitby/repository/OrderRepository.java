package project.bitby.bitby.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.Order;
import project.bitby.bitby.models.TradingPair;
import project.bitby.bitby.models.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Order> findByTradingPairAndStatusIn(TradingPair tradingPair, List<Order.OrderStatus> statuses);
    
    @Query("SELECT o FROM Order o WHERE o.tradingPair = :tradingPair AND o.status IN ('PENDING', 'PARTIAL_FILLED') AND o.side = 'BUY' ORDER BY o.price DESC, o.createdAt ASC")
    List<Order> findActiveBuyOrdersByTradingPair(@Param("tradingPair") TradingPair tradingPair);

    @Query("SELECT o FROM Order o WHERE o.tradingPair = :tradingPair AND o.status IN ('PENDING', 'PARTIAL_FILLED') AND o.side = 'SELL' ORDER BY o.price ASC, o.createdAt ASC")
    List<Order> findActiveSellOrdersByTradingPair(@Param("tradingPair") TradingPair tradingPair);
    
    @Query("SELECT o FROM Order o WHERE o.tradingPair = :tradingPair AND o.status IN ('PENDING', 'PARTIAL_FILLED') AND o.side = 'BUY' AND o.price >= :price AND o.user <> :user ORDER BY o.price DESC, o.createdAt ASC")
    List<Order> findMatchingBuyOrders(@Param("tradingPair") TradingPair tradingPair, @Param("price") BigDecimal price, @Param("user") User user);
    
    @Query("SELECT o FROM Order o WHERE o.tradingPair = :tradingPair AND o.status IN ('PENDING', 'PARTIAL_FILLED') AND o.side = 'SELL' AND o.price <= :price AND o.user <> :user ORDER BY o.price ASC, o.createdAt ASC")
    List<Order> findMatchingSellOrders(@Param("tradingPair") TradingPair tradingPair, @Param("price") BigDecimal price, @Param("user") User user);
    
    Optional<Order> findByIdAndUser(Long orderId, User user);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user = :user AND o.status IN ('PENDING', 'PARTIAL_FILLED')")
    long countActiveOrdersByUser(@Param("user") User user);

    /**
     * Base asset already promised by this user's open SELL orders, so a new
     * order can be weighed against what is actually still free.
     */
    @Query("SELECT COALESCE(SUM(o.remainingQuantity), 0) FROM Order o WHERE o.user = :user " +
           "AND o.side = 'SELL' AND o.status IN ('PENDING', 'PARTIAL_FILLED') " +
           "AND o.tradingPair.baseAsset = :asset")
    BigDecimal sumCommittedBaseAsset(@Param("user") User user, @Param("asset") String asset);

    /** Quote asset already promised by this user's open BUY orders. */
    @Query("SELECT COALESCE(SUM(o.remainingQuantity * o.price), 0) FROM Order o WHERE o.user = :user " +
           "AND o.side = 'BUY' AND o.status IN ('PENDING', 'PARTIAL_FILLED') " +
           "AND o.tradingPair.quoteAsset = :asset AND o.price IS NOT NULL")
    BigDecimal sumCommittedQuoteAsset(@Param("user") User user, @Param("asset") String asset);
} 