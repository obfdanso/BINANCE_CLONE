package project.bitby.bitby.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import project.bitby.bitby.config.FiatRates;
import project.bitby.bitby.dto.MarketDataResponse;
import project.bitby.bitby.dto.PriceHistoryResponse;
import project.bitby.bitby.models.Cryptocurrency;
import project.bitby.bitby.models.PriceHistory;
import project.bitby.bitby.repository.CryptocurrencyRepository;
import project.bitby.bitby.repository.PriceHistoryRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketDataService {

    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final WebClient webClient;
    private final WebSocketService webSocketService;

    // CoinGecko API base URL
    private static final String COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
    
    // Number of top cryptocurrencies to fetch
    private static final int TOP_CRYPTOCURRENCIES_LIMIT = 100;

    /**
     * Fetch market data from CoinGecko API for top cryptocurrencies
     */
    public void fetchAndUpdateMarketData() {
        try {
            // Fetch top cryptocurrencies by market cap
            String url = COINGECKO_API_BASE + "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=" + TOP_CRYPTOCURRENCIES_LIMIT + "&page=1&sparkline=false&locale=en";

            log.info("Fetching market data for top {} cryptocurrencies from URL: {}", TOP_CRYPTOCURRENCIES_LIMIT, url);

            List<Map<String, Object>> response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(new org.springframework.core.ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();

            if (response != null) {
                log.info("Received data for {} cryptocurrencies", response.size());
                
                // Process all cryptocurrencies
                for (Map<String, Object> coinData : response) {
                    log.debug("Processing crypto: {} ({}) - Market Cap: ${}", 
                             coinData.get("name"), 
                             coinData.get("id"),
                             coinData.get("market_cap"));
                    
                    updateCryptocurrencyData(coinData);
                }
                
                log.info("Successfully updated market data for {} cryptocurrencies", response.size());
                
                // Broadcast updated market data via WebSocket
                List<MarketDataResponse> allMarketData = getAllMarketData();
                webSocketService.broadcastMarketData(allMarketData);
            } else {
                log.warn("Received null response from CoinGecko API");
            }
        } catch (Exception e) {
            log.error("Error fetching market data from CoinGecko: {}", e.getMessage(), e);
        }
    }

    /**
     * Update cryptocurrency data in database
     */
    private void updateCryptocurrencyData(Map<String, Object> coinData) {
        try {
            String id = (String) coinData.get("id");  // CoinGecko ID (e.g., "bitcoin")
            String symbol = (String) coinData.get("symbol");  // Symbol (e.g., "btc")
            String name = (String) coinData.get("name");
            
            log.debug("Starting updateCryptocurrencyData for: ID={}, Symbol={}, Name={}", id, symbol, name);
            
            // First try to find by coinGeckoId
            log.debug("Looking for existing record by coinGeckoId: {}", id);
            Optional<Cryptocurrency> existingByIdOpt = cryptocurrencyRepository.findByCoinGeckoId(id);
            
            /*
             * CoinGecko lists several coins that share an upper-cased symbol
             * (BTC is claimed by bitcoin and by wrapped variants, for one).
             * The symbol fallback used to take whichever row already held the
             * symbol and overwrite its coinGeckoId, so two coins fought over
             * one row and the insert that followed violated the unique
             * constraint on coin_gecko_id. Every affected coin was logged as
             * an error on each refresh.
             *
             * coinGeckoId is the stable identity, so it decides. The symbol
             * fallback now only adopts a row that has no coinGeckoId yet -
             * rows written before this field was populated - and a symbol
             * already owned by a different coin is left alone.
             */
            Cryptocurrency crypto;
            if (existingByIdOpt.isPresent()) {
                crypto = existingByIdOpt.get();
                log.debug("Found existing record by ID: {}", id);
            } else {
                String upperSymbol = symbol.toUpperCase();
                Optional<Cryptocurrency> bySymbol = cryptocurrencyRepository.findBySymbol(upperSymbol);

                if (bySymbol.isPresent()) {
                    Cryptocurrency candidate = bySymbol.get();
                    String ownerId = candidate.getCoinGeckoId();

                    if (ownerId != null && !ownerId.equals(id)) {
                        log.debug("Symbol {} already belongs to {}; skipping {}", upperSymbol, ownerId, id);
                        return;
                    }
                    crypto = candidate;
                } else {
                    crypto = new Cryptocurrency();
                }
                crypto.setCoinGeckoId(id);
                log.debug("Created/Found record by symbol: {}", upperSymbol);
            }
            
            log.debug("Setting cryptocurrency properties...");
            crypto.setSymbol(symbol.toUpperCase());
            crypto.setName(name);
            
            // Handle current price with null check
            Object currentPriceObj = coinData.get("current_price");
            if (currentPriceObj != null) {
                crypto.setCurrentPrice(new BigDecimal(currentPriceObj.toString()));
            } else {
                crypto.setCurrentPrice(BigDecimal.ZERO);
                log.warn("Current price is null for {}, setting to zero", symbol);
            }
            
            // Handle price change 24h with null check
            Object priceChangeObj = coinData.get("price_change_24h");
            if (priceChangeObj != null) {
                crypto.setPriceChange24h(new BigDecimal(priceChangeObj.toString()));
            } else {
                crypto.setPriceChange24h(BigDecimal.ZERO);
                log.warn("Price change 24h is null for {}, setting to zero", symbol);
            }
            
            // Handle price change percentage 24h with null check
            Object priceChangePercentObj = coinData.get("price_change_percentage_24h");
            if (priceChangePercentObj != null) {
                crypto.setPriceChangePercentage24h(new BigDecimal(priceChangePercentObj.toString()));
            } else {
                crypto.setPriceChangePercentage24h(BigDecimal.ZERO);
                log.warn("Price change percentage 24h is null for {}, setting to zero", symbol);
            }
            
            // Handle market cap with null check
            Object marketCapObj = coinData.get("market_cap");
            if (marketCapObj != null) {
                BigDecimal marketCap = new BigDecimal(marketCapObj.toString());
                crypto.setMarketCap(marketCap);
                log.debug("Market cap for {}: {}", symbol, marketCap);
            } else {
                crypto.setMarketCap(BigDecimal.ZERO);
                log.warn("Market cap is null for {}, setting to zero", symbol);
            }
            
            // Handle volume with null check
            Object volumeObj = coinData.get("total_volume");
            if (volumeObj != null) {
                BigDecimal volume = new BigDecimal(volumeObj.toString());
                crypto.setVolume24h(volume);
                log.debug("Volume for {}: {}", symbol, volume);
            } else {
                crypto.setVolume24h(BigDecimal.ZERO);
                log.warn("Volume is null for {}, setting to zero", symbol);
            }
            
            // Handle high 24h with null check
            Object high24hObj = coinData.get("high_24h");
            if (high24hObj != null) {
                crypto.setHigh24h(new BigDecimal(high24hObj.toString()));
            } else {
                crypto.setHigh24h(BigDecimal.ZERO);
                log.warn("High 24h is null for {}, setting to zero", symbol);
            }
            
            // Handle low 24h with null check
            Object low24hObj = coinData.get("low_24h");
            if (low24hObj != null) {
                crypto.setLow24h(new BigDecimal(low24hObj.toString()));
            } else {
                crypto.setLow24h(BigDecimal.ZERO);
                log.warn("Low 24h is null for {}, setting to zero", symbol);
            }
            
            crypto.setImageUrl((String) coinData.get("image"));
            crypto.setIsActive(true);
            crypto.setLastUpdated(LocalDateTime.now());
            
            log.debug("About to save cryptocurrency to database...");
            Cryptocurrency savedCrypto = cryptocurrencyRepository.save(crypto);
            log.debug("Successfully saved cryptocurrency with ID: {}", savedCrypto.getId());
            
            // Save price history
            log.debug("Saving price history...");
            savePriceHistory(savedCrypto, crypto.getCurrentPrice(), crypto.getVolume24h());
            
            // Broadcast individual cryptocurrency update
            log.debug("Broadcasting update...");
            MarketDataResponse marketDataResponse = convertToMarketDataResponse(savedCrypto);
            webSocketService.broadcastCryptocurrencyUpdate(marketDataResponse);
            
            log.debug("Completed updateCryptocurrencyData successfully for {}", symbol);
            
        } catch (Exception e) {
            log.error("Error updating cryptocurrency data for {}: {}", coinData.get("symbol"), e.getMessage(), e);
        }
    }

    /**
     * Save price history entry
     */
    private void savePriceHistory(Cryptocurrency cryptocurrency, BigDecimal price, BigDecimal volume) {
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setCryptocurrency(cryptocurrency);
        priceHistory.setPrice(price);
        priceHistory.setVolume(volume);
        priceHistory.setTimestamp(LocalDateTime.now());
        priceHistory.setInterval(PriceHistory.TimeInterval.HOURLY);
        
        priceHistoryRepository.save(priceHistory);
    }

    /**
     * Get all active cryptocurrencies ordered by market cap (highest to lowest)
     */
    public List<MarketDataResponse> getAllMarketData() {
        return cryptocurrencyRepository.findTopByMarketCap()
                .stream()
                .map(this::convertToMarketDataResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get market data by symbol
     */
    public Optional<MarketDataResponse> getMarketDataBySymbol(String symbol) {
        // Every other symbol reports currentPrice in USD (BTC ~ 76000, USDT ~ 1),
        // so the fiat entries must use the same unit. They previously did not:
        // GHS was priced at 1.0 and USD at 10.41, which are cedi-denominated.
        // Callers that divide one currentPrice by another - /convert/quote most
        // visibly - therefore priced 1 GHS as roughly 1 USDT.
        if (symbol.equalsIgnoreCase("GHS")) {
            MarketDataResponse ghs = new MarketDataResponse();
            ghs.setSymbol("GHS");
            ghs.setName("Ghanaian Cedi");
            ghs.setCurrentPrice(FiatRates.USD_PER_GHS);
            return Optional.of(ghs);
        }
        if (symbol.equalsIgnoreCase("USD")) {
            MarketDataResponse usd = new MarketDataResponse();
            usd.setSymbol("USD");
            usd.setName("US Dollar");
            usd.setCurrentPrice(FiatRates.USD_PER_USD);
            return Optional.of(usd);
        }
        return cryptocurrencyRepository.findBySymbol(symbol.toUpperCase())
                .map(this::convertToMarketDataResponse);
    }

    /**
     * Get top cryptocurrencies by market cap
     */
    public List<MarketDataResponse> getTopByMarketCap(int limit) {
        return cryptocurrencyRepository.findTopByMarketCap()
                .stream()
                .limit(limit)
                .map(this::convertToMarketDataResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get top gainers
     */
    public List<MarketDataResponse> getTopGainers(int limit) {
        return cryptocurrencyRepository.findTopGainers()
                .stream()
                .limit(limit)
                .map(this::convertToMarketDataResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get top losers
     */
    public List<MarketDataResponse> getTopLosers(int limit) {
        return cryptocurrencyRepository.findTopLosers()
                .stream()
                .limit(limit)
                .map(this::convertToMarketDataResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get price history for a cryptocurrency
     */
    public List<PriceHistoryResponse> getPriceHistory(String symbol, int days) {
        Optional<Cryptocurrency> crypto = cryptocurrencyRepository.findBySymbol(symbol.toUpperCase());
        if (crypto.isEmpty()) {
            return List.of();
        }

        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        List<PriceHistory> history = priceHistoryRepository
                .findByCryptocurrencyAndTimestampAfterOrderByTimestampAsc(crypto.get(), startTime);

        return history.stream()
                .map(this::convertToPriceHistoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert Cryptocurrency entity to MarketDataResponse DTO
     */
    private MarketDataResponse convertToMarketDataResponse(Cryptocurrency crypto) {
        return new MarketDataResponse(
                crypto.getSymbol(),
                crypto.getName(),
                crypto.getCurrentPrice(),
                crypto.getPriceChange24h(),
                crypto.getPriceChangePercentage24h(),
                crypto.getMarketCap(),
                crypto.getVolume24h(),
                crypto.getHigh24h(),
                crypto.getLow24h(),
                crypto.getImageUrl(),
                crypto.getLastUpdated()
        );
    }

    /**
     * Convert PriceHistory entity to PriceHistoryResponse DTO
     */
    private PriceHistoryResponse convertToPriceHistoryResponse(PriceHistory history) {
        return new PriceHistoryResponse(
                history.getCryptocurrency().getSymbol(),
                history.getPrice(),
                history.getVolume(),
                history.getTimestamp(),
                history.getInterval()
        );
    }

    /**
     * Scheduled task to update market data every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void scheduledMarketDataUpdate() {
        log.info("Starting scheduled market data update for top {} cryptocurrencies", TOP_CRYPTOCURRENCIES_LIMIT);
        fetchAndUpdateMarketData();
    }

    /**
     * Initialize market data on application startup
     */
    public void initializeMarketData() {
        log.info("Initializing market data for top {} cryptocurrencies by market cap...", TOP_CRYPTOCURRENCIES_LIMIT);
        fetchAndUpdateMarketData();
    }
}