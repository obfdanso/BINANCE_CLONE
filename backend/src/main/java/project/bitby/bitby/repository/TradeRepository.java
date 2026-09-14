package project.bitby.bitby.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.Trade;
import project.bitby.bitby.models.TradingPair;
import project.bitby.bitby.models.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    
    List<Trade> findByTradingPairOrderByExecutedAtDesc(TradingPair tradingPair);
    
    Page<Trade> findByTradingPairOrderByExecutedAtDesc(TradingPair tradingPair, Pageable pageable);
    
    List<Trade> findByMakerUserOrTakerUserOrderByExecutedAtDesc(User makerUser, User takerUser);
    
    Page<Trade> findByMakerUserOrTakerUserOrderByExecutedAtDesc(User makerUser, User takerUser, Pageable pageable);
    
    @Query("SELECT t FROM Trade t WHERE t.tradingPair = :tradingPair AND t.executedAt >= :since ORDER BY t.executedAt DESC")
    List<Trade> findRecentTradesByTradingPair(@Param("tradingPair") TradingPair tradingPair, @Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Trade t WHERE t.tradingPair = :tradingPair ORDER BY t.executedAt DESC LIMIT :limit")
    List<Trade> findRecentTradesByTradingPairLimit(@Param("tradingPair") TradingPair tradingPair, @Param("limit") int limit);
} 