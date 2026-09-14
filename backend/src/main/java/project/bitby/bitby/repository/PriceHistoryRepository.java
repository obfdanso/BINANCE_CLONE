package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.Cryptocurrency;
import project.bitby.bitby.models.PriceHistory;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    
    List<PriceHistory> findByCryptocurrencyOrderByTimestampDesc(Cryptocurrency cryptocurrency);
    
    @Query("SELECT ph FROM PriceHistory ph WHERE ph.cryptocurrency = :crypto AND ph.timestamp >= :startTime ORDER BY ph.timestamp ASC")
    List<PriceHistory> findByCryptocurrencyAndTimestampAfterOrderByTimestampAsc(
            @Param("crypto") Cryptocurrency cryptocurrency, 
            @Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT ph FROM PriceHistory ph WHERE ph.cryptocurrency = :crypto AND ph.interval = :interval AND ph.timestamp >= :startTime ORDER BY ph.timestamp ASC")
    List<PriceHistory> findByCryptocurrencyAndIntervalAndTimestampAfterOrderByTimestampAsc(
            @Param("crypto") Cryptocurrency cryptocurrency,
            @Param("interval") PriceHistory.TimeInterval interval,
            @Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT ph FROM PriceHistory ph WHERE ph.cryptocurrency = :crypto ORDER BY ph.timestamp DESC LIMIT 1")
    PriceHistory findLatestByCryptocurrency(@Param("crypto") Cryptocurrency cryptocurrency);
} 