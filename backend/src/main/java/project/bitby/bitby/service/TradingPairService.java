package project.bitby.bitby.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.bitby.bitby.dto.TradingPairResponse;
import project.bitby.bitby.models.TradingPair;
import project.bitby.bitby.repository.TradingPairRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TradingPairService {

    private final TradingPairRepository tradingPairRepository;
    private final MarketDataService marketDataService;

    /**
     * Initialize default trading pairs
     */
    public void initializeDefaultTradingPairs() {
        if (tradingPairRepository.count() == 0) {
            log.info("Initializing default trading pairs...");
            
            // Create default trading pairs
            createTradingPair("BTC", "USDT", "BTCUSDT", 
                new BigDecimal("0.001"), new BigDecimal("1000"), 2, 6);
            
            createTradingPair("ETH", "USDT", "ETHUSDT", 
                new BigDecimal("0.01"), new BigDecimal("10000"), 2, 6);
            
            createTradingPair("BNB", "USDT", "BNBUSDT", 
                new BigDecimal("0.1"), new BigDecimal("100000"), 2, 6);
            
            createTradingPair("BTC", "GHS", "BTCGHS", 
                new BigDecimal("0.001"), new BigDecimal("1000"), 2, 6);
            
            createTradingPair("ETH", "GHS", "ETHGHS", 
                new BigDecimal("0.01"), new BigDecimal("10000"), 2, 6);
            
            log.info("Default trading pairs initialized successfully");
        }
    }

    /**
     * Create a new trading pair
     */
    private void createTradingPair(String baseAsset, String quoteAsset, String symbol,
                                  BigDecimal minOrderSize, BigDecimal maxOrderSize,
                                  Integer pricePrecision, Integer quantityPrecision) {
        TradingPair tradingPair = new TradingPair();
        tradingPair.setBaseAsset(baseAsset);
        tradingPair.setQuoteAsset(quoteAsset);
        tradingPair.setSymbol(symbol);
        tradingPair.setMinOrderSize(minOrderSize);
        tradingPair.setMaxOrderSize(maxOrderSize);
        tradingPair.setPricePrecision(pricePrecision);
        tradingPair.setQuantityPrecision(quantityPrecision);
        tradingPair.setIsActive(true);
        
        tradingPairRepository.save(tradingPair);
        log.info("Created trading pair: {}", symbol);
    }

    /**
     * Get all active trading pairs
     */
    public List<TradingPairResponse> getAllActiveTradingPairs() {
        return tradingPairRepository.findActiveTradingPairs()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get trading pair by symbol
     */
    public Optional<TradingPairResponse> getTradingPairBySymbol(String symbol) {
        return tradingPairRepository.findBySymbol(symbol)
                .map(this::convertToResponse);
    }

    /**
     * Get trading pair entity by symbol
     */
    public Optional<TradingPair> getTradingPairEntityBySymbol(String symbol) {
        return tradingPairRepository.findBySymbol(symbol);
    }

    /**
     * Convert TradingPair entity to TradingPairResponse DTO
     */
    private TradingPairResponse convertToResponse(TradingPair tradingPair) {
        TradingPairResponse response = new TradingPairResponse();
        response.setId(tradingPair.getId());
        response.setBaseAsset(tradingPair.getBaseAsset());
        response.setQuoteAsset(tradingPair.getQuoteAsset());
        response.setSymbol(tradingPair.getSymbol());
        response.setMinOrderSize(tradingPair.getMinOrderSize());
        response.setMaxOrderSize(tradingPair.getMaxOrderSize());
        response.setPricePrecision(tradingPair.getPricePrecision());
        response.setQuantityPrecision(tradingPair.getQuantityPrecision());
        response.setTradingFee(tradingPair.getTradingFee());
        response.setMakerFee(tradingPair.getMakerFee());
        response.setTakerFee(tradingPair.getTakerFee());
        response.setIsActive(tradingPair.getIsActive());
        response.setCreatedAt(tradingPair.getCreatedAt());
        response.setLastUpdated(tradingPair.getLastUpdated());

        // Add market data if available
        try {
            var marketData = marketDataService.getMarketDataBySymbol(tradingPair.getBaseAsset());
            if (marketData.isPresent()) {
                response.setLastPrice(marketData.get().getCurrentPrice());
                response.setPriceChange24h(marketData.get().getPriceChange24h());
                response.setPriceChangePercentage24h(marketData.get().getPriceChangePercentage24h());
                response.setVolume24h(marketData.get().getVolume24h());
                response.setHigh24h(marketData.get().getHigh24h());
                response.setLow24h(marketData.get().getLow24h());
            }
        } catch (Exception e) {
            log.warn("Could not fetch market data for {}: {}", tradingPair.getBaseAsset(), e.getMessage());
        }

        return response;
    }
} 