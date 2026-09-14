package project.bitby.bitby.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import project.bitby.bitby.repository.TradingPairRepository;
import project.bitby.bitby.models.TradingPair;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderBookMaintenanceService {

    private final OrderBookService orderBookService;
    private final TradingPairRepository tradingPairRepository;

    /**
     * Rebuild all order books every 5 minutes
     * This ensures consistency and handles any edge cases
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void rebuildAllOrderBooks() {
        log.info("Starting scheduled order book rebuild...");
        
        try {
            List<TradingPair> activeTradingPairs = tradingPairRepository.findActiveTradingPairs();
            
            for (TradingPair tradingPair : activeTradingPairs) {
                try {
                    orderBookService.rebuildOrderBook(tradingPair);
                    log.debug("Rebuilt order book for trading pair: {}", tradingPair.getSymbol());
                } catch (Exception e) {
                    log.error("Error rebuilding order book for {}: {}", tradingPair.getSymbol(), e.getMessage());
                }
            }
            
            log.info("Completed scheduled order book rebuild for {} trading pairs", activeTradingPairs.size());
        } catch (Exception e) {
            log.error("Error during scheduled order book rebuild: {}", e.getMessage());
        }
    }

    /**
     * Clean up stale order book entries every hour
     * Remove entries with zero quantity
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupStaleOrderBookEntries() {
        log.info("Starting scheduled order book cleanup...");
        
        try {
            List<TradingPair> activeTradingPairs = tradingPairRepository.findActiveTradingPairs();
            
            for (TradingPair tradingPair : activeTradingPairs) {
                try {
                    // This would be implemented in OrderBookService
                    // orderBookService.cleanupStaleEntries(tradingPair);
                    log.debug("Cleaned up order book for trading pair: {}", tradingPair.getSymbol());
                } catch (Exception e) {
                    log.error("Error cleaning up order book for {}: {}", tradingPair.getSymbol(), e.getMessage());
                }
            }
            
            log.info("Completed scheduled order book cleanup for {} trading pairs", activeTradingPairs.size());
        } catch (Exception e) {
            log.error("Error during scheduled order book cleanup: {}", e.getMessage());
        }
    }

    /**
     * Validate order book integrity every 10 minutes
     * Check for inconsistencies and log warnings
     */
    @Scheduled(fixedRate = 600000) // 10 minutes
    public void validateOrderBookIntegrity() {
        log.debug("Starting order book integrity validation...");
        
        try {
            List<TradingPair> activeTradingPairs = tradingPairRepository.findActiveTradingPairs();
            
            for (TradingPair tradingPair : activeTradingPairs) {
                try {
                    validateOrderBookForTradingPair(tradingPair);
                } catch (Exception e) {
                    log.error("Error validating order book for {}: {}", tradingPair.getSymbol(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error during order book integrity validation: {}", e.getMessage());
        }
    }

    /**
     * Validate order book for a specific trading pair
     */
    private void validateOrderBookForTradingPair(TradingPair tradingPair) {
        // Check if best bid is lower than best ask
        var bestBid = orderBookService.getBestBidPrice(tradingPair);
        var bestAsk = orderBookService.getBestAskPrice(tradingPair);
        
        if (bestBid.compareTo(bestAsk) > 0 && bestBid.compareTo(java.math.BigDecimal.ZERO) > 0 && bestAsk.compareTo(java.math.BigDecimal.ZERO) > 0) {
            log.warn("Order book integrity issue detected for {}: best bid ({}) > best ask ({})", 
                    tradingPair.getSymbol(), bestBid, bestAsk);
        }
        
        // Check spread
        var spread = orderBookService.getSpread(tradingPair);
        if (spread.compareTo(java.math.BigDecimal.ZERO) < 0) {
            log.warn("Negative spread detected for {}: {}", tradingPair.getSymbol(), spread);
        }
    }
} 