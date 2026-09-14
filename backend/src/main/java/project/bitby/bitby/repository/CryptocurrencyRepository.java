package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.Cryptocurrency;

import java.util.List;
import java.util.Optional;

@Repository
public interface CryptocurrencyRepository extends JpaRepository<Cryptocurrency, Long> {
    
    Optional<Cryptocurrency> findBySymbol(String symbol);
    
    Optional<Cryptocurrency> findByCoinGeckoId(String coinGeckoId);
    
    List<Cryptocurrency> findByIsActiveTrue();
    
    @Query("SELECT c FROM Cryptocurrency c WHERE c.isActive = true ORDER BY c.marketCap DESC")
    List<Cryptocurrency> findTopByMarketCap();
    
    @Query("SELECT c FROM Cryptocurrency c WHERE c.isActive = true ORDER BY c.priceChangePercentage24h DESC")
    List<Cryptocurrency> findTopGainers();
    
    @Query("SELECT c FROM Cryptocurrency c WHERE c.isActive = true ORDER BY c.priceChangePercentage24h ASC")
    List<Cryptocurrency> findTopLosers();
    
    @Query("SELECT c FROM Cryptocurrency c WHERE c.isActive = true ORDER BY c.volume24h DESC")
    List<Cryptocurrency> findTopByVolume();
}