package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.TradingPair;

import java.util.List;
import java.util.Optional;

@Repository
public interface TradingPairRepository extends JpaRepository<TradingPair, Long> {
    
    Optional<TradingPair> findBySymbol(String symbol);
    
    List<TradingPair> findByIsActiveTrue();
    
    @Query("SELECT tp FROM TradingPair tp WHERE tp.isActive = true ORDER BY tp.symbol")
    List<TradingPair> findActiveTradingPairs();
    
    Optional<TradingPair> findByBaseAssetAndQuoteAsset(String baseAsset, String quoteAsset);
    
    boolean existsBySymbol(String symbol);
} 