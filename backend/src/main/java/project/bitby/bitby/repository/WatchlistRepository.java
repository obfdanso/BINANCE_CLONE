package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.User;
import project.bitby.bitby.models.Watchlist;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    
    List<Watchlist> findByUserOrderByAddedAtDesc(User user);
    
    Optional<Watchlist> findByUserAndCryptocurrencySymbol(User user, String symbol);
    
    boolean existsByUserAndCryptocurrencySymbol(User user, String symbol);
    
    void deleteByUserAndCryptocurrencySymbol(User user, String symbol);
} 