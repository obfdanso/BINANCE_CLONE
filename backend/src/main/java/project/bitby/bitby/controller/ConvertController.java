package project.bitby.bitby.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.ConvertQuoteRequest;
import project.bitby.bitby.dto.ConvertQuoteResponse;
import project.bitby.bitby.dto.ConvertRequest;
import project.bitby.bitby.dto.ConvertResponse;
import project.bitby.bitby.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestHeader;
import project.bitby.bitby.security.JwtUtils;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/convert")
@RequiredArgsConstructor
@Slf4j
public class ConvertController {

    private final project.bitby.bitby.service.ConvertService convertService;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Get a quote for conversion
     */
    @PostMapping("/quote")
    public ResponseEntity<ConvertQuoteResponse> getQuote(@Valid @RequestBody ConvertQuoteRequest request) {
        log.info("Quote request received: {} {} to {}", 
                request.getAmount(), request.getFromSymbol(), request.getToSymbol());
        
        ConvertQuoteResponse response = convertService.getQuote(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Create instant conversion
     */
    @PostMapping("/instant")
    public ResponseEntity<ConvertResponse> createInstantConvert(@Valid @RequestBody ConvertRequest request, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        log.info("Instant convert request received from user {}: {} {} to {}", userId, request.getAmount(), request.getFromSymbol(), request.getToSymbol());
        ConvertResponse response = convertService.createInstantConvert(request, userId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Create limit conversion order
     */
    @PostMapping("/limit")
    public ResponseEntity<ConvertResponse> createLimitConvert(@Valid @RequestBody ConvertRequest request, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        log.info("Limit convert request received from user {}: {} {} to {} at price {}", userId, request.getAmount(), request.getFromSymbol(), request.getToSymbol(), request.getTargetPrice());
        ConvertResponse response = convertService.createLimitConvert(request, userId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Create recurring conversion order
     */
    @PostMapping("/recurring")
    public ResponseEntity<ConvertResponse> createRecurringConvert(@Valid @RequestBody ConvertRequest request, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        log.info("Recurring convert request received from user {}: {} {} to {} every {}", userId, request.getAmount(), request.getFromSymbol(), request.getToSymbol(), request.getRecurringInterval());
        ConvertResponse response = convertService.createRecurringConvert(request, userId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get user's convert orders
     */
    @GetMapping("/orders")
    public ResponseEntity<List<ConvertResponse>> getUserOrders(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        log.info("Get orders request received from user {}", userId);
        List<ConvertResponse> orders = convertService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Cancel a convert order
     */
    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<ConvertResponse> cancelOrder(@PathVariable Long orderId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        log.info("Cancel order request received from user {} for order {}", userId, orderId);
        ConvertResponse response = convertService.cancelOrder(orderId, userId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get available convert types
     */
    @GetMapping("/types")
    public ResponseEntity<Object> getConvertTypes() {
        return ResponseEntity.ok(new Object() {
            public final String[] types = {"INSTANT", "LIMIT", "RECURRING"};
            public final String[] recurringIntervals = {"DAILY", "WEEKLY", "MONTHLY"};
        });
    }
} 