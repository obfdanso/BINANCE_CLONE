package project.bitby.bitby.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.MessageResponse;
import project.bitby.bitby.dto.WatchlistRequest;
import project.bitby.bitby.dto.WatchlistResponse;
import project.bitby.bitby.security.JwtUtils;
import project.bitby.bitby.security.UserDetailsImpl;
import project.bitby.bitby.service.WatchlistService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/watchlist")
@RequiredArgsConstructor
@Tag(name = "Watchlist", description = "Watchlist management APIs")
@CrossOrigin(origins = "*")
public class WatchlistController {

    private final WatchlistService watchlistService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping
    @Operation(summary = "Get user's watchlist", description = "Retrieve all cryptocurrencies in user's watchlist")
    public ResponseEntity<List<WatchlistResponse>> getUserWatchlist(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.getUsernameFromJwtToken(token);
        List<WatchlistResponse> watchlist = watchlistService.getUserWatchlist(username);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping("/add")
    @Operation(summary = "Add to watchlist", description = "Add a cryptocurrency to user's watchlist")
    public ResponseEntity<MessageResponse> addToWatchlist(
            @RequestBody WatchlistRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.getUsernameFromJwtToken(token);
        
        boolean success = watchlistService.addToWatchlist(username, request.getSymbol());
        
        if (success) {
            return ResponseEntity.ok(new MessageResponse("Cryptocurrency added to watchlist successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to add cryptocurrency to watchlist"));
        }
    }

    @DeleteMapping("/remove/{symbol}")
    @Operation(summary = "Remove from watchlist", description = "Remove a cryptocurrency from user's watchlist")
    public ResponseEntity<MessageResponse> removeFromWatchlist(
            @Parameter(description = "Cryptocurrency symbol (e.g., BTC, ETH)") 
            @PathVariable String symbol,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.getUsernameFromJwtToken(token);
        
        boolean success = watchlistService.removeFromWatchlist(username, symbol);
        
        if (success) {
            return ResponseEntity.ok(new MessageResponse("Cryptocurrency removed from watchlist successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to remove cryptocurrency from watchlist"));
        }
    }

    @GetMapping("/check/{symbol}")
    @Operation(summary = "Check watchlist status", description = "Check if a cryptocurrency is in user's watchlist")
    public ResponseEntity<Boolean> isInWatchlist(
            @Parameter(description = "Cryptocurrency symbol (e.g., BTC, ETH)") 
            @PathVariable String symbol,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.getUsernameFromJwtToken(token);
        boolean isInWatchlist = watchlistService.isInWatchlist(username, symbol);
        return ResponseEntity.ok(isInWatchlist);
    }
} 