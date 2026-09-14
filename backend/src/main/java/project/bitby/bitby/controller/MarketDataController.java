package project.bitby.bitby.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.MarketDataResponse;
import project.bitby.bitby.dto.PriceHistoryResponse;
import project.bitby.bitby.service.MarketDataService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/market")
@RequiredArgsConstructor
@Tag(name = "Market Data", description = "Market data management APIs")
@CrossOrigin(origins = "*")
public class MarketDataController {

    private final MarketDataService marketDataService;

    @GetMapping("/all")
    @Operation(summary = "Get all market data", description = "Retrieve market data for all active cryptocurrencies")
    public ResponseEntity<List<MarketDataResponse>> getAllMarketData() {
        List<MarketDataResponse> marketData = marketDataService.getAllMarketData();
        return ResponseEntity.ok(marketData);
    }

    @GetMapping("/crypto/{symbol}")
    @Operation(summary = "Get cryptocurrency data", description = "Retrieve market data for a specific cryptocurrency")
    public ResponseEntity<MarketDataResponse> getCryptocurrencyData(
            @Parameter(description = "Cryptocurrency symbol (e.g., BTC, ETH)") 
            @PathVariable String symbol) {
        return marketDataService.getMarketDataBySymbol(symbol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/top/market-cap")
    @Operation(summary = "Get top cryptocurrencies by market cap", description = "Retrieve top cryptocurrencies sorted by market capitalization")
    public ResponseEntity<List<MarketDataResponse>> getTopByMarketCap(
            @Parameter(description = "Number of results to return (default: 10)") 
            @RequestParam(defaultValue = "10") int limit) {
        List<MarketDataResponse> topCryptos = marketDataService.getTopByMarketCap(limit);
        return ResponseEntity.ok(topCryptos);
    }

    @GetMapping("/top/gainers")
    @Operation(summary = "Get top gainers", description = "Retrieve cryptocurrencies with highest 24h price gains")
    public ResponseEntity<List<MarketDataResponse>> getTopGainers(
            @Parameter(description = "Number of results to return (default: 10)") 
            @RequestParam(defaultValue = "10") int limit) {
        List<MarketDataResponse> topGainers = marketDataService.getTopGainers(limit);
        return ResponseEntity.ok(topGainers);
    }

    @GetMapping("/top/losers")
    @Operation(summary = "Get top losers", description = "Retrieve cryptocurrencies with highest 24h price losses")
    public ResponseEntity<List<MarketDataResponse>> getTopLosers(
            @Parameter(description = "Number of results to return (default: 10)") 
            @RequestParam(defaultValue = "10") int limit) {
        List<MarketDataResponse> topLosers = marketDataService.getTopLosers(limit);
        return ResponseEntity.ok(topLosers);
    }

    @GetMapping("/crypto/{symbol}/history")
    @Operation(summary = "Get price history", description = "Retrieve historical price data for a cryptocurrency")
    public ResponseEntity<List<PriceHistoryResponse>> getPriceHistory(
            @Parameter(description = "Cryptocurrency symbol (e.g., BTC, ETH)") 
            @PathVariable String symbol,
            @Parameter(description = "Number of days to retrieve (default: 7)") 
            @RequestParam(defaultValue = "7") int days) {
        List<PriceHistoryResponse> history = marketDataService.getPriceHistory(symbol, days);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh market data", description = "Manually trigger a refresh of market data from external APIs")
    public ResponseEntity<String> refreshMarketData() {
        marketDataService.fetchAndUpdateMarketData();
        return ResponseEntity.ok("Market data refresh initiated");
    }

    @GetMapping("/search")
    @Operation(summary = "Search cryptocurrencies", description = "Search cryptocurrencies by name or symbol")
    public ResponseEntity<List<MarketDataResponse>> searchCryptocurrencies(
            @Parameter(description = "Search query") 
            @RequestParam String query) {
        // This would need to be implemented in the service
        // For now, return all market data and filter on the client side
        List<MarketDataResponse> allData = marketDataService.getAllMarketData();
        List<MarketDataResponse> filteredData = allData.stream()
                .filter(crypto -> crypto.getName().toLowerCase().contains(query.toLowerCase()) ||
                                crypto.getSymbol().toLowerCase().contains(query.toLowerCase()))
                .toList();
        return ResponseEntity.ok(filteredData);
    }
} 