package project.bitby.bitby.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.*;
import project.bitby.bitby.service.AssetService;
import project.bitby.bitby.service.PaystackService; // (to be created)
import project.bitby.bitby.service.RevenueInitializationService;
import project.bitby.bitby.security.JwtUtils;
import org.springframework.security.core.Authentication;
import project.bitby.bitby.security.UserDetailsImpl;

import java.math.BigDecimal;
import java.security.Principal;

@RestController
@RequestMapping("/api/assets")
public class AssetsController {

    private final AssetService assetService;
    // private final MtnMomoService mtnMomoService;
    private final PaystackService paystackService; // (to be created)
    private final RevenueInitializationService revenueInitializationService;
    
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    public AssetsController(AssetService assetService, PaystackService paystackService, RevenueInitializationService revenueInitializationService) {
        this.assetService = assetService;
        this.paystackService = paystackService;
        this.revenueInitializationService = revenueInitializationService;
    }

    @GetMapping("/overview")
    public ResponseEntity<AssetOverviewResponse> getAssetOverview(Authentication authentication, @RequestParam String selectedCurrency) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        AssetOverviewResponse response = assetService.getAssetOverview(userId, selectedCurrency);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/price-history")
    public ResponseEntity<AssetPriceHistoryResponse> getPriceHistory() {
        AssetPriceHistoryResponse response = assetService.getAssetPriceHistory();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit")
    public ResponseEntity<DepositResponse> deposit(@RequestBody DepositRequest request, @RequestParam String currency) {
        DepositResponse response = paystackService.initializeDeposit(request, currency);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/paystack/webhook")
    public ResponseEntity<?> paystackWebhook(@RequestBody String payload, @RequestHeader("x-paystack-signature") String signature) {
        paystackService.handleWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/buy")
    public ResponseEntity<BuyAssetResponse> buyAsset(@RequestBody BuyAssetRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        BuyAssetResponse response = assetService.buyAsset(request, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<WithdrawResponse> withdraw(@RequestBody WithdrawRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        WithdrawResponse response = paystackService.initiateWithdrawal(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Initialize the application with 20 billion USD starting revenue
     * This endpoint can be called manually to set up the revenue pool
     */
    @PostMapping("/initialize-revenue")
    public ResponseEntity<?> initializeRevenue() {
        try {
            revenueInitializationService.initializeApplicationRevenue();
            return ResponseEntity.ok(new MessageResponse("Application revenue initialized successfully with 20 billion USD"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error initializing revenue: " + e.getMessage()));
        }
    }

    /**
     * Get the current system revenue status
     */
    @GetMapping("/system-revenue")
    public ResponseEntity<?> getSystemRevenue() {
        try {
            BigDecimal currentRevenue = revenueInitializationService.getCurrentSystemRevenue();
            return ResponseEntity.ok(new SystemRevenueResponse(currentRevenue));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error getting system revenue: " + e.getMessage()));
        }
    }

    /**
     * Check if system has sufficient balance for a specific currency and amount
     */
    @GetMapping("/check-balance")
    public ResponseEntity<?> checkSystemBalance(@RequestParam String currency, @RequestParam BigDecimal amount) {
        try {
            boolean hasBalance = revenueInitializationService.hasSufficientBalance(currency, amount);
            return ResponseEntity.ok(new BalanceCheckResponse(currency, amount, hasBalance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error checking balance: " + e.getMessage()));
        }
    }

    // Response classes for new endpoints
    public static class SystemRevenueResponse {
        private BigDecimal totalRevenue;
        private String message;

        public SystemRevenueResponse(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
            this.message = "Current system revenue: $" + totalRevenue.toString();
        }

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class BalanceCheckResponse {
        private String currency;
        private BigDecimal amount;
        private boolean hasSufficientBalance;
        private String message;

        public BalanceCheckResponse(String currency, BigDecimal amount, boolean hasSufficientBalance) {
            this.currency = currency;
            this.amount = amount;
            this.hasSufficientBalance = hasSufficientBalance;
            this.message = hasSufficientBalance ? 
                "System has sufficient " + currency + " balance" : 
                "System has insufficient " + currency + " balance";
        }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public boolean isHasSufficientBalance() { return hasSufficientBalance; }
        public void setHasSufficientBalance(boolean hasSufficientBalance) { this.hasSufficientBalance = hasSufficientBalance; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
} 