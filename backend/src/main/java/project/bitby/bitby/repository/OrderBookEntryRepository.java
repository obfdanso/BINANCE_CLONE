package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.OrderBookEntry;
import project.bitby.bitby.models.TradingPair;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderBookEntryRepository extends JpaRepository<OrderBookEntry, Long> {
    
    List<OrderBookEntry> findByTradingPairAndSideOrderByPriceAsc(TradingPair tradingPair, OrderBookEntry.OrderSide side);
    
    List<OrderBookEntry> findByTradingPairAndSideOrderByPriceDesc(TradingPair tradingPair, OrderBookEntry.OrderSide side);
    
    @Query("SELECT obe FROM OrderBookEntry obe WHERE obe.tradingPair = :tradingPair AND obe.side = 'BID' ORDER BY obe.price DESC")
    List<OrderBookEntry> findBidsByTradingPair(@Param("tradingPair") TradingPair tradingPair);
    
    @Query("SELECT obe FROM OrderBookEntry obe WHERE obe.tradingPair = :tradingPair AND obe.side = 'ASK' ORDER BY obe.price ASC")
    List<OrderBookEntry> findAsksByTradingPair(@Param("tradingPair") TradingPair tradingPair);
    
    @Query("SELECT obe FROM OrderBookEntry obe WHERE obe.tradingPair = :tradingPair AND obe.side = 'BID' ORDER BY obe.price DESC LIMIT :limit")
    List<OrderBookEntry> findTopBidsByTradingPair(@Param("tradingPair") TradingPair tradingPair, @Param("limit") int limit);
    
    @Query("SELECT obe FROM OrderBookEntry obe WHERE obe.tradingPair = :tradingPair AND obe.side = 'ASK' ORDER BY obe.price ASC LIMIT :limit")
    List<OrderBookEntry> findTopAsksByTradingPair(@Param("tradingPair") TradingPair tradingPair, @Param("limit") int limit);
    
    OrderBookEntry findByTradingPairAndSideAndPrice(TradingPair tradingPair, OrderBookEntry.OrderSide side, BigDecimal price);
    
    void deleteByTradingPairAndSideAndPrice(TradingPair tradingPair, OrderBookEntry.OrderSide side, BigDecimal price);
} 