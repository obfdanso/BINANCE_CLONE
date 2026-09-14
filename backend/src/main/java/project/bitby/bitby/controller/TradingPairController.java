package project.bitby.bitby.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.TradingPairResponse;
import project.bitby.bitby.service.TradingPairService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trading/pairs")
@RequiredArgsConstructor
@Tag(name = "Trading Pairs", description = "Trading pairs management APIs")
@CrossOrigin(origins = "*")
public class TradingPairController {

    private final TradingPairService tradingPairService;

    @GetMapping
    @Operation(summary = "Get all active trading pairs", description = "Retrieve all active trading pairs with market data")
    public ResponseEntity<List<TradingPairResponse>> getAllTradingPairs() {
        List<TradingPairResponse> tradingPairs = tradingPairService.getAllActiveTradingPairs();
        return ResponseEntity.ok(tradingPairs);
    }

    @GetMapping("/{symbol}")
    @Operation(summary = "Get trading pair by symbol", description = "Retrieve specific trading pair information")
    public ResponseEntity<TradingPairResponse> getTradingPairBySymbol(
            @Parameter(description = "Trading pair symbol (e.g., BTCUSDT, ETHUSDT)") 
            @PathVariable String symbol) {
        return tradingPairService.getTradingPairBySymbol(symbol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{symbol}/ticker")
    @Operation(summary = "Get trading pair ticker", description = "Get 24h ticker information for a trading pair")
    public ResponseEntity<TradingPairResponse> getTradingPairTicker(
            @Parameter(description = "Trading pair symbol (e.g., BTCUSDT, ETHUSDT)") 
            @PathVariable String symbol) {
        return tradingPairService.getTradingPairBySymbol(symbol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 