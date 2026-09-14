package project.bitby.bitby.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.bitby.bitby.dto.WatchlistResponse;
import project.bitby.bitby.models.Cryptocurrency;
import project.bitby.bitby.models.User;
import project.bitby.bitby.models.Watchlist;
import project.bitby.bitby.repository.CryptocurrencyRepository;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.repository.WatchlistRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final UserRepository userRepository;

    /**
     * Add cryptocurrency to user's watchlist
     */
    public boolean addToWatchlist(String username, String symbol) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            log.warn("User with username {} not found", username);
            return false;
        }
        User user = userOpt.get();
        try {
            Optional<Cryptocurrency> crypto = cryptocurrencyRepository.findBySymbol(symbol.toUpperCase());
            if (crypto.isEmpty()) {
                log.warn("Cryptocurrency with symbol {} not found", symbol);
                return false;
            }

            if (watchlistRepository.existsByUserAndCryptocurrencySymbol(user, symbol.toUpperCase())) {
                log.info("Cryptocurrency {} already in watchlist for user {}", symbol, user.getUsername());
                return false;
            }

            Watchlist watchlist = new Watchlist();
            watchlist.setUser(user);
            watchlist.setCryptocurrency(crypto.get());
            
            watchlistRepository.save(watchlist);
            log.info("Added {} to watchlist for user {}", symbol, user.getUsername());
            return true;
        } catch (Exception e) {
            log.error("Error adding {} to watchlist for user {}: {}", symbol, user.getUsername(), e.getMessage());
            return false;
        }
    }

    /**
     * Remove cryptocurrency from user's watchlist
     */
    public boolean removeFromWatchlist(String username, String symbol) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            log.warn("User with username {} not found", username);
            return false;
        }
        User user = userOpt.get();
        try {
            if (!watchlistRepository.existsByUserAndCryptocurrencySymbol(user, symbol.toUpperCase())) {
                log.warn("Cryptocurrency {} not in watchlist for user {}", symbol, user.getUsername());
                return false;
            }

            watchlistRepository.deleteByUserAndCryptocurrencySymbol(user, symbol.toUpperCase());
            log.info("Removed {} from watchlist for user {}", symbol, user.getUsername());
            return true;
        } catch (Exception e) {
            log.error("Error removing {} from watchlist for user {}: {}", symbol, user.getUsername(), e.getMessage());
            return false;
        }
    }

    /**
     * Get user's watchlist
     */
    public List<WatchlistResponse> getUserWatchlist(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            log.warn("User with username {} not found", username);
            return List.of();
        }
        User user = userOpt.get();
        try {
            List<Watchlist> watchlist = watchlistRepository.findByUserOrderByAddedAtDesc(user);
            
            return watchlist.stream()
                    .map(this::convertToWatchlistResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting watchlist for user {}: {}", user.getUsername(), e.getMessage());
            return List.of();
        }
    }

    /**
     * Check if cryptocurrency is in user's watchlist
     */
    public boolean isInWatchlist(String username, String symbol) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            log.warn("User with username {} not found", username);
            return false;
        }
        User user = userOpt.get();
        return watchlistRepository.existsByUserAndCryptocurrencySymbol(user, symbol.toUpperCase());
    }

    /**
     * Convert Watchlist entity to WatchlistResponse DTO
     */
    private WatchlistResponse convertToWatchlistResponse(Watchlist watchlist) {
        Cryptocurrency crypto = watchlist.getCryptocurrency();
        return new WatchlistResponse(
                crypto.getSymbol(),
                crypto.getName(),
                crypto.getCurrentPrice() != null ? crypto.getCurrentPrice().toString() : "0",
                crypto.getPriceChangePercentage24h() != null ? crypto.getPriceChangePercentage24h().toString() : "0",
                crypto.getImageUrl(),
                watchlist.getAddedAt()
        );
    }
} 